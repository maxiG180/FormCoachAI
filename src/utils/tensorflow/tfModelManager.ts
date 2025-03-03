import * as tf from '@tensorflow/tfjs';
import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { AIInsight } from "@/types/analyze";

// Define model parameters
const MODEL_INPUT_SIZE = 51; // 17 landmarks x 3 coordinates (x, y, visibility)
const FORM_CATEGORIES = ['perfect', 'knees_inward', 'back_not_straight', 'not_deep_enough', 'imbalanced'];

export class TFModelManager {
  private model: tf.LayersModel | null = null;
  private isModelLoaded: boolean = false;
  private isTraining: boolean = false;
  private trainingData: {input: number[][], output: number[][]} = {
    input: [],
    output: []
  };
  private lastTrainingTime: number = 0;
  private trainingThreshold: number = 10; // Min examples before training
  private trainingInterval: number = 24 * 60 * 60 * 1000; // Train once per day

  constructor() {
    this.initModel();
  }

  private async initModel() {
    try {
      // Try to load the saved model
      this.model = await tf.loadLayersModel('indexeddb://squat-analysis-model');
      console.log("Loaded existing model from IndexedDB");
      this.isModelLoaded = true;
    } catch (error) {
      console.log("Creating new model", error);
      this.createNewModel();
    }
  }

  private createNewModel() {
    // Create a simple model to analyze pose keypoints
    const model = tf.sequential();
    
    // Input layer (51 inputs for 17 landmarks x 3 values)
    model.add(tf.layers.dense({
      inputShape: [MODEL_INPUT_SIZE],
      units: 128,
      activation: 'relu'
    }));
    
    // Hidden layers
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.25 }));
    
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    
    // Output layer (5 categories: perfect, knees_inward, back_not_straight, not_deep_enough, imbalanced)
    model.add(tf.layers.dense({
      units: FORM_CATEGORIES.length,
      activation: 'softmax'
    }));
    
    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    
    this.model = model;
    this.isModelLoaded = true;
    
    console.log("New model created");
  }

  public async saveModel() {
    if (this.model) {
      await this.model.save('indexeddb://squat-analysis-model');
      console.log("Model saved to IndexedDB");
    }
  }

  // Convert pose landmarks to tensor input format
  private poseToTensor(pose: PoseLandmarkerResult): tf.Tensor {
    if (!pose.landmarks || !pose.landmarks[0]) {
      throw new Error("No landmarks found in pose");
    }
    
    const landmarks = pose.landmarks[0];
    const flattenedData: number[] = [];
    
    // Flatten the landmark data (x, y, visibility)
    landmarks.slice(0, 17).forEach(landmark => {
      flattenedData.push(landmark.x);
      flattenedData.push(landmark.y);
      flattenedData.push(landmark.visibility || 0);
    });
    
    return tf.tensor2d([flattenedData]);
  }

  // Predict form issues based on the current pose
  public async predictFormIssues(pose: PoseLandmarkerResult): Promise<AIInsight> {
    if (!this.model || !this.isModelLoaded) {
      throw new Error("Model not loaded");
    }
    
    try {
      const inputTensor = this.poseToTensor(pose);
      
      // Run inference
      const predictions = await this.model.predict(inputTensor) as tf.Tensor;
      const probabilities = await predictions.data();
      
      // Get the highest probability category
      const maxIndex = tf.argMax(predictions as tf.Tensor).dataSync()[0];
      const maxCategory = FORM_CATEGORIES[maxIndex];
      const confidence = probabilities[maxIndex];

      // Get all issues with confidence > 0.2
      const issues = FORM_CATEGORIES.map((category, index) => ({
        type: category,
        confidence: probabilities[index]
      })).filter(issue => issue.confidence > 0.2 && issue.type !== 'perfect');
      
      // Cleanup tensors
      inputTensor.dispose();
      predictions.dispose();
      
      return {
        category: maxCategory,
        confidence,
        issues
      };
    } catch (error) {
      console.error("Error predicting form issues:", error);
      return {
        category: 'unknown',
        confidence: 0,
        issues: []
      };
    }
  }

  // Add training example
  public addTrainingExample(pose: PoseLandmarkerResult, category: string): void {
    if (!pose.landmarks || !pose.landmarks[0]) {
      console.error("No landmarks found in pose");
      return;
    }
    
    try {
      const landmarks = pose.landmarks[0];
      const flattenedData: number[] = [];
      
      // Flatten the landmark data
      landmarks.slice(0, 17).forEach(landmark => {
        flattenedData.push(landmark.x);
        flattenedData.push(landmark.y);
        flattenedData.push(landmark.visibility || 0);
      });
      
      // Create one-hot encoded output
      const output = new Array(FORM_CATEGORIES.length).fill(0);
      const categoryIndex = FORM_CATEGORIES.indexOf(category);
      if (categoryIndex >= 0) {
        output[categoryIndex] = 1;
      } else {
        console.error("Unknown category:", category);
        return;
      }
      
      // Add to training data
      this.trainingData.input.push(flattenedData);
      this.trainingData.output.push(output);
      
      console.log(`Added training example for category: ${category}`);
      
      // Check if we should train the model
      this.checkAndTrain();
    } catch (error) {
      console.error("Error adding training example:", error);
    }
  }
  
  // Check if we have enough data and it's been long enough since the last training
  private async checkAndTrain(): Promise<void> {
    const currentTime = Date.now();
    const enoughExamples = this.trainingData.input.length >= this.trainingThreshold;
    const timeToTrain = currentTime - this.lastTrainingTime > this.trainingInterval;
    
    if (enoughExamples && timeToTrain && !this.isTraining) {
      console.log("Starting model training in background");
      await this.trainModel(30); // Train with 30 epochs
      this.lastTrainingTime = currentTime;
    }
  }

  // Train the model with collected examples
  public async trainModel(epochs: number = 50): Promise<void> {
    if (!this.model || this.trainingData.input.length === 0) {
      console.error("No model or training data available");
      return;
    }
    
    try {
      this.isTraining = true;
      
      const inputTensor = tf.tensor2d(this.trainingData.input);
      const outputTensor = tf.tensor2d(this.trainingData.output);
      
      console.log(`Training with ${this.trainingData.input.length} examples`);
      
      // Train the model
      await this.model.fit(inputTensor, outputTensor, {
        epochs,
        batchSize: 16,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
          }
        }
      });
      
      // Save the updated model
      await this.saveModel();
      
      // Cleanup tensors
      inputTensor.dispose();
      outputTensor.dispose();
      
      console.log("Model training completed");
    } catch (error) {
      console.error("Error training model:", error);
    } finally {
      this.isTraining = false;
    }
  }

  public isLoaded(): boolean {
    return this.isModelLoaded;
  }
  
  public isCurrentlyTraining(): boolean {
    return this.isTraining;
  }
  
  public getTrainingDataSize(): number {
    return this.trainingData.input.length;
  }
}

// Create a singleton instance
const tfModelManager = new TFModelManager();
export default tfModelManager;