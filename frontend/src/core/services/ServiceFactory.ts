import { LocalStorageService } from './LocalStorageService';
import { NutritionCalculatorService } from './NutritionCalculatorService';
import { AudioEffectsService } from './AudioEffectsService';
import { ClientMenuScannerService } from './ClientMenuScannerService';

export class ServiceFactory {
  private static storageInstance: LocalStorageService;
  private static calculatorInstance: NutritionCalculatorService;
  private static audioInstance: AudioEffectsService;
  private static scannerInstance: ClientMenuScannerService;

  public static getStorageService(): LocalStorageService {
    if (!this.storageInstance) {
      this.storageInstance = new LocalStorageService('messnutri_');
    }
    return this.storageInstance;
  }

  public static getCalculatorService(): NutritionCalculatorService {
    if (!this.calculatorInstance) {
      this.calculatorInstance = new NutritionCalculatorService();
    }
    return this.calculatorInstance;
  }

  public static getAudioService(): AudioEffectsService {
    if (!this.audioInstance) {
      this.audioInstance = new AudioEffectsService();
    }
    return this.audioInstance;
  }

  public static getScannerService(): ClientMenuScannerService {
    if (!this.scannerInstance) {
      this.scannerInstance = new ClientMenuScannerService();
    }
    return this.scannerInstance;
  }
}
