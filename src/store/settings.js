import {defineStore} from 'pinia';

// 创建一个新的 Pinia Store
export const useSettingsStore = defineStore({
    // Store 的唯一标识符
    id: 'settings',

    // 定义状态
    state: () => ({
        night: false,
    }),

    // 定义操作
    actions: {
        toggleNight() {
            this.state.night = !this.state.night;
        }
    },
});
