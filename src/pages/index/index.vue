<template>
  <view class="container">
    <view class="wheel-container" v-show="!showDialog">
      <canvas
        class="lucky-wheel"
        canvas-id="luckyWheel"
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
      ></canvas>
      <view class="pointer-container">
        <view class="pointer" @tap="startRotate"></view>
      </view>
    </view>

    <view class="button-container">
      <button class="edit-button" @tap="showEditDialog">修改选项</button>
    </view>

    <view class="dialog-mask" v-if="showDialog" @tap="closeDialog">
      <view class="dialog-content" @tap.stop>
        <view class="dialog-header">
          <text class="dialog-title">修改选项</text>
          <text class="dialog-close" @tap="closeDialog">×</text>
        </view>

        <scroll-view class="prize-list" scroll-y>
          <view class="prize-item" v-for="(prize, index) in editingPrizes" :key="index">
            <view class="prize-row">
              <input class="prize-input" v-model="prize.name" placeholder="奖品名称" />
              <input class="color-input" v-model="prize.color" placeholder="颜色代码" />
              <button class="delete-btn" @tap="deletePrize(index)" v-if="editingPrizes.length > 2">删除</button>
            </view>
          </view>
        </scroll-view>

        <view class="dialog-footer">
          <button class="add-btn" @tap="addPrize">添加选项</button>
          <button class="save-btn" @tap="savePrizes">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue'

  interface Prize {
    name: string
    color: string
  }

  const canvasWidth = ref(300)
  const canvasHeight = ref(300)
  const prizes = ref<Prize[]>([
    { name: '不导', color: '#FFF4D6' },
    { name: '现在导', color: '#FFDFDF' },
    { name: '晚上导', color: '#DDF4FF' },
    { name: '早中晚各一次', color: '#EEDDFF' },
    { name: '不导', color: '#E7FFE7' },
    { name: '下月导', color: '#FFE7E7' },
  ])
  const isRotating = ref(false)
  const ctx = ref<any>(null)
  const currentAngle = ref(0)
  const targetAngle = ref(0)
  const showDialog = ref(false)
  const editingPrizes = ref<Prize[]>([])

  const initCanvas = () => {
    ctx.value = uni.createCanvasContext('luckyWheel')
    drawWheel()
  }

  const drawWheel = () => {
    const context = ctx.value
    const centerX = canvasWidth.value / 2
    const centerY = canvasHeight.value / 2
    const radius = Math.min(centerX, centerY) - 10

    context.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
    const anglePerPrize = (Math.PI * 2) / prizes.value.length

    prizes.value.forEach((prize, index) => {
      const startAngleTemp = -index * anglePerPrize + (currentAngle.value * Math.PI / 180)
      const endAngle = startAngleTemp + anglePerPrize

      context.beginPath()
      context.moveTo(centerX, centerY)
      context.arc(centerX, centerY, radius, startAngleTemp, endAngle)
      context.closePath()

      context.fillStyle = prize.color
      context.fill()

      context.strokeStyle = '#FFFFFF'
      context.lineWidth = 1
      context.stroke()

      context.save()
      context.translate(centerX, centerY)
      context.rotate(startAngleTemp + anglePerPrize / 2)
      context.fillStyle = '#333333'
      context.font = '14px Arial'
      context.textAlign = 'center'
      context.fillText(prize.name, radius * 0.65, 0)
      context.restore()
    })

    context.draw()
  }

  const startRotate = () => {
    if (isRotating.value) return
    isRotating.value = true
    const randomIndex = Math.floor(Math.random() * prizes.value.length)
    const circles = 4 + Math.floor(Math.random() * 4)
    const anglePerPrize = 360 / prizes.value.length
    targetAngle.value = circles * 360 + (prizes.value.length - randomIndex) * anglePerPrize
    rotateWheel()
  }

  const rotateWheel = () => {
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 5)
    const duration = 4000
    const startTime = Date.now()
    const startAngleValue = currentAngle.value

    const step = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime

      if (elapsed < duration) {
        const progress = elapsed / duration
        const easedProgress = easeOut(progress)
        currentAngle.value = startAngleValue + (targetAngle.value - startAngleValue) * easedProgress
        drawWheel()
        setTimeout(step, 16)
      } else {
        currentAngle.value = targetAngle.value
        drawWheel()
        isRotating.value = false

        const finalAngle = targetAngle.value % 360
        const anglePerPrize = 360 / prizes.value.length
        const prizeIndex = Math.floor((360 - finalAngle + anglePerPrize / 2) % 360 / anglePerPrize)

        uni.showToast({
          title: prizes.value[prizeIndex].name,
          icon: 'none'
        })
      }
    }
    step()
  }

  const showEditDialog = () => {
    editingPrizes.value = JSON.parse(JSON.stringify(prizes.value))
    showDialog.value = true
  }

  const closeDialog = () => {
    showDialog.value = false
    nextTick(() => {
      initCanvas()
    })
  }

  const addPrize = () => {
    editingPrizes.value.push({
      name: '新选项',
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    })
  }

  const deletePrize = (index: number) => {
    if (editingPrizes.value.length > 2) {
      editingPrizes.value.splice(index, 1)
    } else {
      uni.showToast({
        title: '至少需要2个选项',
        icon: 'none'
      })
    }
  }

  const savePrizes = () => {
    const isValid = editingPrizes.value.every(prize => prize.name.trim() && /^#[0-9A-Fa-f]{6}$/.test(prize.color))
    if (!isValid) {
      uni.showToast({
        title: '请填写正确的选项名称和颜色代码',
        icon: 'none'
      })
      return
    }
    prizes.value = JSON.parse(JSON.stringify(editingPrizes.value))
    closeDialog()
    drawWheel()
  }

  onMounted(() => {
    initCanvas()
  })
</script>

<style>
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  .wheel-container {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 20px 0;
  }

  .lucky-wheel {
    display: block;
    width: 100%;
    height: 100%;
  }

  .pointer-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    z-index: 20;
  }

  .pointer {
    width: 60px;
    height: 60px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    position: relative;
    z-index: 21;
  }

  .pointer::after {
    content: '';
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid #FF6B6B;
  }

  .button-container {
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .edit-button {
    background-color: #007AFF;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
  }

  .dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog-content {
    width: 80%;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .dialog-title {
    font-size: 18px;
    font-weight: bold;
  }

  .dialog-close {
    font-size: 24px;
    color: #999;
    padding: 5px;
  }

  .prize-list {
    max-height: 50vh;
  }

  .prize-item {
    margin-bottom: 15px;
  }

  .prize-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .prize-input {
    flex: 2;
    border: 1px solid #ddd;
    padding: 5px 10px;
    border-radius: 4px;
  }

  .color-input {
    flex: 1;
    border: 1px solid #ddd;
    padding: 5px 10px;
    border-radius: 4px;
  }

  .delete-btn {
    padding: 5px 10px;
    background-color: #ff4444;
    color: white;
    border-radius: 4px;
    font-size: 14px;
  }

  .dialog-footer {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .add-btn, .save-btn {
    flex: 1;
    padding: 8px;
    border-radius: 4px;
    font-size: 16px;
  }

  .add-btn {
    background-color: #4CAF50;
    color: white;
  }

  .save-btn {
    background-color: #007AFF;
    color: white;
  }
</style>