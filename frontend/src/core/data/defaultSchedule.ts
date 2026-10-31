import { WeeklyMessSchedule } from '../types/nutrition';

export const DEFAULT_WEEKLY_MESS_SCHEDULE: WeeklyMessSchedule = {
  monday: {
    breakfast: ['poha', 'milk_glass_250', 'banana_medium'],
    lunch: ['roti_plain', 'steamed_rice', 'dal_yellow_tadka', 'bhindi_masala', 'curd_dahi'],
    snacks: ['banana_medium'],
    dinner: ['roti_plain', 'steamed_rice', 'dal_makhani', 'aloo_gobi'],
  },
  tuesday: {
    breakfast: ['idli_set', 'sambar', 'milk_glass_250'],
    lunch: ['roti_plain', 'jeera_rice', 'rajma_masala', 'curd_dahi'],
    snacks: ['apple_medium'],
    dinner: ['roti_plain', 'steamed_rice', 'yellow_dal_tadka', 'bhindi_masala'],
  },
  wednesday: {
    breakfast: ['upma', 'sambar', 'milk_glass_250'],
    lunch: ['roti_plain', 'steamed_rice', 'chole_curry', 'curd_dahi'],
    snacks: ['banana_medium'],
    dinner: ['roti_plain', 'steamed_rice', 'dal_yellow_tadka', 'paneer_bhurji'],
  },
  thursday: {
    breakfast: ['poha', 'banana_medium', 'milk_glass_250'],
    lunch: ['roti_plain', 'steamed_rice', 'dal_yellow_tadka', 'aloo_gobi', 'curd_dahi'],
    snacks: ['guava'],
    dinner: ['roti_plain', 'steamed_rice', 'dal_makhani', 'bhindi_masala'],
  },
  friday: {
    breakfast: ['aloo_paratha', 'curd_dahi', 'milk_glass_250'],
    lunch: ['roti_plain', 'jeera_rice', 'rajma_masala', 'curd_dahi'],
    snacks: ['banana_medium'],
    dinner: ['roti_plain', 'steamed_rice', 'soya_chunks_curry', 'dal_yellow_tadka'],
  },
  saturday: {
    breakfast: ['idli_set', 'sambar', 'milk_glass_250'],
    lunch: ['khichdi', 'curd_dahi', 'papaya_bowl'],
    snacks: ['apple_medium'],
    dinner: ['paratha_plain', 'chole_curry', 'steamed_rice'],
  },
  sunday: {
    breakfast: ['poori', 'chole_curry', 'milk_glass_250'],
    lunch: ['roti_plain', 'jeera_rice', 'paneer_bhurji', 'dal_yellow_tadka', 'curd_dahi'],
    snacks: ['banana_medium'],
    dinner: ['roti_plain', 'steamed_rice', 'dal_makhani', 'aloo_gobi'],
  },
};
