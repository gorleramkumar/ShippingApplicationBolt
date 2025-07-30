<template>
  <div class="shipment-section">
    <div class="section-header">
      <h2>🚚 Your Shipments</h2>
      <p>Track and manage all your shipping orders</p>
    </div>

    <div v-if="orders.length === 0" class="empty-state">
      <div class="empty-icon">📦</div>
      <h3>No shipments yet</h3>
      <p>Create your first shipping order to see it here</p>
    </div>

    <div v-else class="shipments-grid">
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="shipment-card"
      >
        <div class="card-header">
          <div class="tracking-info">
            <span class="tracking-number">{{ order.trackingNumber }}</span>
            <span :class="['status-badge', order.status]">
              {{ getStatusText(order.status) }}
            </span>
          </div>
          <div class="order-date">
            {{ formatDate(order.createdAt) }}
          </div>
        </div>

        <div class="shipping-details">
          <div class="address-section">
            <div class="address-block">
              <h4>📍 From</h4>
              <p class="name">{{ order.fromName }}</p>
              <p class="address">{{ order.fromAddress }}</p>
              <p class="postcode">{{ order.fromPostCode }}</p>
            </div>
            <div class="shipping-arrow">→</div>
            <div class="address-block">
              <h4>📍 To</h4>
              <p class="name">{{ order.toName }}</p>
              <p class="address">{{ order.toAddress }}</p>
              <p class="postcode">{{ order.toPostCode }}</p>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="shipping-info">
            <span class="shipping-type">
              {{ order.shippingPriority === 'express' ? '⚡ Express' : '📦 Standard' }}
            </span>
            <span class="price">${{ order.price }}</span>
          </div>
          <button 
            class="track-btn"
            @click="trackOrder(order)"
          >
            Track Order
          </button>
        </div>
      </div>
    </div>

    <!-- Order Tracking Modal -->
    <div v-if="showTrackingModal" class="modal-overlay" @click="closeTrackingModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>📦 Order Tracking</h3>
          <button class="close-btn" @click="closeTrackingModal">×</button>
        </div>
        <div class="modal-body">
          <div class="tracking-header">
            <h4>{{ selectedOrder?.trackingNumber }}</h4>
            <span :class="['status-badge', selectedOrder?.status]">
              {{ getStatusText(selectedOrder?.status || 'pending') }}
            </span>
          </div>
          <div class="tracking-timeline">
            <div :class="['timeline-item', { active: true }]">
              <div class="timeline-icon">✅</div>
              <div class="timeline-content">
                <h5>Order Created</h5>
                <p>{{ formatDate(selectedOrder?.createdAt || '') }}</p>
              </div>
            </div>
            <div :class="['timeline-item', { active: selectedOrder?.status !== 'pending' }]">
              <div class="timeline-icon">🚚</div>
              <div class="timeline-content">
                <h5>In Transit</h5>
                <p>Your package is on the way</p>
              </div>
            </div>
            <div :class="['timeline-item', { active: selectedOrder?.status === 'delivered' }]">
              <div class="timeline-icon">📍</div>
              <div class="timeline-content">
                <h5>Delivered</h5>
                <p>Package delivered successfully</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Order } from '../types/order'

defineProps<{
  orders: Order[]
}>()

const showTrackingModal = ref(false)
const selectedOrder = ref<Order | null>(null)

const getStatusText = (status: string) => {
  const statusMap = {
    pending: 'Pending',
    'in-transit': 'In Transit',
    delivered: 'Delivered'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const trackOrder = (order: Order) => {
  selectedOrder.value = order
  showTrackingModal.value = true
}

const closeTrackingModal = () => {
  showTrackingModal.value = false
  selectedOrder.value = null
}
</script>

<style scoped>
.shipment-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #1E293B;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: #64748B;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #1E293B;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748B;
}

.shipments-grid {
  display: grid;
  gap: 1.5rem;
}

.shipment-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.shipment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #F1F5F9;
}

.tracking-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tracking-number {
  font-weight: 700;
  color: #2563EB;
  font-size: 1.1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #FEF3C7;
  color: #D97706;
}

.status-badge.in-transit {
  background: #DBEAFE;
  color: #2563EB;
}

.status-badge.delivered {
  background: #D1FAE5;
  color: #10B981;
}

.order-date {
  color: #64748B;
  font-size: 0.875rem;
}

.shipping-details {
  margin-bottom: 1rem;
}

.address-section {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
}

.address-block h4 {
  color: #2563EB;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.address-block .name {
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 0.25rem;
}

.address-block .address {
  color: #64748B;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.address-block .postcode {
  color: #64748B;
  font-size: 0.875rem;
  font-weight: 500;
}

.shipping-arrow {
  font-size: 1.5rem;
  color: #2563EB;
  text-align: center;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 2px solid #F1F5F9;
}

.shipping-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.shipping-type {
  color: #64748B;
  font-size: 0.875rem;
}

.price {
  font-weight: 700;
  color: #F97316;
  font-size: 1.1rem;
}

.track-btn {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.track-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -4px rgba(16, 185, 129, 0.5);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  color: #1E293B;
  font-size: 1.5rem;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #64748B;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tracking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tracking-header h4 {
  color: #2563EB;
  font-size: 1.2rem;
  margin: 0;
}

.tracking-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.timeline-item.active {
  background: #F0F9FF;
}

.timeline-icon {
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #E5E7EB;
}

.timeline-item.active .timeline-icon {
  background: #DBEAFE;
}

.timeline-content h5 {
  color: #1E293B;
  margin: 0 0 0.25rem 0;
}

.timeline-content p {
  color: #64748B;
  margin: 0;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .address-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .shipping-arrow {
    transform: rotate(90deg);
  }

  .card-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .track-btn {
    width: 100%;
  }

  .modal-content {
    margin: 1rem;
    padding: 1rem;
  }
}
</style>