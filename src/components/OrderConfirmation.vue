<template>
  <div class="confirmation-section">
    <div class="confirmation-card">
      <div class="success-header">
        <div class="success-icon">✅</div>
        <h2>Order Created Successfully!</h2>
        <p>Your shipping order has been created and is being processed</p>
      </div>

      <div class="order-details">
        <div class="detail-header">
          <h3>📦 Order Details</h3>
          <div class="tracking-info">
            <span class="tracking-label">Tracking Number:</span>
            <span class="tracking-number">{{ order?.trackingNumber }}</span>
          </div>
        </div>

        <div class="details-grid">
          <div class="detail-section">
            <h4>📍 From</h4>
            <div class="address-info">
              <p class="name">{{ order?.fromName }}</p>
              <p class="address">{{ order?.fromAddress }}</p>
              <p class="postcode">{{ order?.fromPostCode }}</p>
            </div>
          </div>

          <div class="detail-section">
            <h4>📍 To</h4>
            <div class="address-info">
              <p class="name">{{ order?.toName }}</p>
              <p class="address">{{ order?.toAddress }}</p>
              <p class="postcode">{{ order?.toPostCode }}</p>
            </div>
          </div>
        </div>

        <div class="shipping-summary">
          <div class="summary-row">
            <span>Shipping Method:</span>
            <span class="shipping-type">
              {{ order?.shippingPriority === 'express' ? '⚡ Express Shipping' : '📦 Standard Shipping' }}
            </span>
          </div>
          <div class="summary-row">
            <span>Delivery Time:</span>
            <span>{{ getDeliveryTime(order?.shippingPriority || 'standard') }}</span>
          </div>
          <div class="summary-row">
            <span>Order Date:</span>
            <span>{{ formatDate(order?.createdAt || '') }}</span>
          </div>
          <div class="summary-row total">
            <span>Total Cost:</span>
            <span class="price">${{ order?.price }}</span>
          </div>
        </div>

        <div class="status-info">
          <div class="status-item">
            <span class="status-icon">📧</span>
            <div class="status-text">
              <h5>Email Confirmation</h5>
              <p>A confirmation email has been sent with your order details</p>
            </div>
          </div>
          <div class="status-item">
            <span class="status-icon">📱</span>
            <div class="status-text">
              <h5>SMS Updates</h5>
              <p>You'll receive SMS updates about your shipment status</p>
            </div>
          </div>
          <div class="status-item">
            <span class="status-icon">🔍</span>
            <div class="status-text">
              <h5>Track Your Order</h5>
              <p>Use your tracking number to monitor your shipment progress</p>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="secondary-btn" @click="handleViewShipments">
          🚚 View All Shipments
        </button>
        <button class="primary-btn" @click="handleCreateAnother">
          ⚡ Create Another Order
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '../types/order'

defineProps<{
  order: Order | null
}>()

const emit = defineEmits<{
  createAnother: []
  viewShipments: []
}>()

const getDeliveryTime = (priority: string) => {
  return priority === 'express' ? '1-2 business days' : '5-7 business days'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleCreateAnother = () => {
  emit('createAnother')
}

const handleViewShipments = () => {
  emit('viewShipments')
}
</script>

<style scoped>
.confirmation-section {
  max-width: 800px;
  margin: 0 auto;
}

.confirmation-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.success-header {
  text-align: center;
  margin-bottom: 2rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-header h2 {
  color: #10B981;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.success-header p {
  color: #64748B;
  font-size: 1.1rem;
}

.order-details {
  margin-bottom: 2rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #F1F5F9;
}

.detail-header h3 {
  color: #2563EB;
  font-size: 1.5rem;
  margin: 0;
}

.tracking-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.tracking-label {
  color: #64748B;
  font-size: 0.875rem;
}

.tracking-number {
  color: #2563EB;
  font-weight: 700;
  font-size: 1.1rem;
  background: #EBF4FF;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section h4 {
  color: #2563EB;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.address-info .name {
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 0.5rem;
}

.address-info .address {
  color: #64748B;
  margin-bottom: 0.5rem;
}

.address-info .postcode {
  color: #64748B;
  font-weight: 500;
}

.shipping-summary {
  background: #F8FAFC;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.summary-row.total {
  border-top: 2px solid #E2E8F0;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.shipping-type {
  color: #2563EB;
  font-weight: 500;
}

.price {
  color: #F97316;
  font-weight: 700;
  font-size: 1.2rem;
}

.status-info {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #F0F9FF;
  border-radius: 0.75rem;
  border-left: 4px solid #2563EB;
}

.status-icon {
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-text h5 {
  color: #1E293B;
  font-size: 0.95rem;
  margin: 0 0 0.25rem 0;
}

.status-text p {
  color: #64748B;
  font-size: 0.875rem;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.secondary-btn,
.primary-btn {
  flex: 1;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.secondary-btn {
  background: #F1F5F9;
  color: #475569;
}

.secondary-btn:hover {
  background: #E2E8F0;
  transform: translateY(-2px);
}

.primary-btn {
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  color: white;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(37, 99, 235, 0.5);
}

@media (max-width: 768px) {
  .confirmation-card {
    padding: 1rem;
  }

  .detail-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .tracking-info {
    align-items: flex-start;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>