<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1>⚡ Bolt Shipping</h1>
          </div>
          <nav class="nav">
            <button 
              :class="['nav-btn', { active: activeSection === 'order' }]"
              @click="setActiveSection('order')"
            >
              📦 New Order
            </button>
            <button 
              :class="['nav-btn', { active: activeSection === 'shipments' }]"
              @click="setActiveSection('shipments')"
            >
              🚚 Shipments
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <transition name="fade" mode="out-in">
          <OrderSection 
            v-if="activeSection === 'order'" 
            @order-created="handleOrderCreated"
            @show-confirmation="showConfirmation"
          />
          <ShipmentSection 
            v-else-if="activeSection === 'shipments'"
            :orders="orders"
          />
          <OrderConfirmation
            v-else-if="activeSection === 'confirmation'"
            :order="currentOrder"
            @create-another="createAnotherOrder"
            @view-shipments="viewShipments"
          />
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import OrderSection from './components/OrderSection.vue'
import ShipmentSection from './components/ShipmentSection.vue'
import OrderConfirmation from './components/OrderConfirmation.vue'
import type { Order } from './types/order'

const activeSection = ref<'order' | 'shipments' | 'confirmation'>('order')
const orders = ref<Order[]>([])
const currentOrder = ref<Order | null>(null)

const setActiveSection = (section: 'order' | 'shipments') => {
  activeSection.value = section
}

const handleOrderCreated = (order: Order) => {
  orders.value.unshift(order)
  currentOrder.value = order
  saveOrdersToStorage()
}

const showConfirmation = (order: Order) => {
  currentOrder.value = order
  activeSection.value = 'confirmation'
}

const createAnotherOrder = () => {
  activeSection.value = 'order'
  currentOrder.value = null
}

const viewShipments = () => {
  activeSection.value = 'shipments'
  currentOrder.value = null
}

const saveOrdersToStorage = () => {
  localStorage.setItem('bolt-orders', JSON.stringify(orders.value))
}

const loadOrdersFromStorage = () => {
  const stored = localStorage.getItem('bolt-orders')
  if (stored) {
    orders.value = JSON.parse(stored)
  }
}

onMounted(() => {
  loadOrdersFromStorage()
})
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-btn.active {
  background: white;
  color: #2563EB;
}

.main {
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    width: 100%;
    justify-content: center;
  }

  .nav-btn {
    flex: 1;
    text-align: center;
  }
}
</style>