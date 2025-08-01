<template>
  <div class="order-section">
    <div class="section-header">
      <h2>📦 Create New Shipping Order</h2>
      <p>Fill in the details below to create your shipping order</p>
    </div>

    <form @submit.prevent="handleSubmit" class="order-form">
      <div class="form-grid">
        <!-- From Section -->
        <div class="form-section">
          <h3>📍 From</h3>
          <div class="form-group">
            <label for="fromName">Sender Name *</label>
            <input
              id="fromName"
              v-model="form.fromName"
              type="text"
              :class="['form-input', { error: errors.fromName }]"
              placeholder="Enter sender's full name"
              required
            />
            <span v-if="errors.fromName" class="error-message">{{ errors.fromName }}</span>
          </div>

          <div class="form-group">
            <label for="fromAddress">Sender Address *</label>
            <textarea
              id="fromAddress"
              v-model="form.fromAddress"
              :class="['form-input', 'form-textarea', { error: errors.fromAddress }]"
              placeholder="Enter complete sender address"
              rows="3"
              required
            ></textarea>
            <span v-if="errors.fromAddress" class="error-message">{{ errors.fromAddress }}</span>
          </div>

          <div class="form-group">
            <label for="fromPostCode">Sender Post Code *</label>
            <input
              id="fromPostCode"
              v-model="form.fromPostCode"
              type="text"
              :class="['form-input', { error: errors.fromPostCode }]"
              placeholder="Enter post code"
              required
            />
            <span v-if="errors.fromPostCode" class="error-message">{{ errors.fromPostCode }}</span>
          </div>
        </div>

        <!-- To Section -->
        <div class="form-section">
          <h3>📍 To</h3>
          <div class="form-group">
            <label for="toName">Recipient Name *</label>
            <input
              id="toName"
              v-model="form.toName"
              type="text"
              :class="['form-input', { error: errors.toName }]"
              placeholder="Enter recipient's full name"
              required
            />
            <span v-if="errors.toName" class="error-message">{{ errors.toName }}</span>
          </div>

          <div class="form-group">
            <label for="toAddress">Recipient Address *</label>
            <textarea
              id="toAddress"
              v-model="form.toAddress"
              :class="['form-input', 'form-textarea', { error: errors.toAddress }]"
              placeholder="Enter complete recipient address"
              rows="3"
              required
            ></textarea>
            <span v-if="errors.toAddress" class="error-message">{{ errors.toAddress }}</span>
          </div>

          <div class="form-group">
            <label for="toPostCode">Recipient Post Code *</label>
            <input
              id="toPostCode"
              v-model="form.toPostCode"
              type="text"
              :class="['form-input', { error: errors.toPostCode }]"
              placeholder="Enter post code"
              required
            />
            <span v-if="errors.toPostCode" class="error-message">{{ errors.toPostCode }}</span>
          </div>
        </div>
      </div>

      <!-- Shipping Options -->
      <div class="shipping-section">
        <h3>🚚 Shipping Options</h3>
        <div class="shipping-options">
          <div 
            v-for="rate in shippingRates" 
            :key="rate.type"
            :class="['shipping-option', { selected: form.shippingPriority === rate.type }]"
            @click="selectShippingRate(rate)"
          >
            <div class="option-header">
              <div class="option-title">
                <span class="option-name">{{ rate.name }}</span>
                <span class="option-price">${{ rate.price }}</span>
              </div>
              <div class="option-delivery">{{ rate.deliveryTime }}</div>
            </div>
            <p class="option-description">{{ rate.description }}</p>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div v-if="selectedRate" class="order-summary">
        <h3>📋 Order Summary</h3>
        <div class="summary-details">
          <div class="summary-row">
            <span>Shipping Method:</span>
            <span>{{ selectedRate.name }}</span>
          </div>
          <div class="summary-row">
            <span>Delivery Time:</span>
            <span>{{ selectedRate.deliveryTime }}</span>
          </div>
          <div class="summary-row total">
            <span>Total Cost:</span>
            <span>${{ selectedRate.price }}</span>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        :disabled="!isFormValid || isSubmitting"
        class="submit-btn"
      >
        <span v-if="isSubmitting">Creating Order...</span>
        <span v-else>⚡ Create Shipping Order</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Order, ShippingRate } from '../types/order'

const emit = defineEmits<{
  orderCreated: [order: Order]
  showConfirmation: [order: Order]
}>()

const form = ref({
  fromName: '',
  fromAddress: '',
  fromPostCode: '',
  toName: '',
  toAddress: '',
  toPostCode: '',
  shippingPriority: '' as 'standard' | 'express' | ''
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const shippingRates: ShippingRate[] = [
  {
    type: 'standard',
    name: 'Standard Shipping',
    price: 12.99,
    deliveryTime: '5-7 business days',
    description: 'Reliable delivery at an affordable price'
  },
  {
    type: 'express',
    name: 'Express Shipping',
    price: 24.99,
    deliveryTime: '1-2 business days',
    description: 'Fast delivery for urgent shipments'
  }
]

const selectedRate = computed(() => {
  return shippingRates.find(rate => rate.type === form.value.shippingPriority)
})

const isFormValid = computed(() => {
  return form.value.fromName.trim() &&
         form.value.fromAddress.trim() &&
         form.value.fromPostCode.trim() &&
         form.value.toName.trim() &&
         form.value.toAddress.trim() &&
         form.value.toPostCode.trim() &&
         form.value.shippingPriority &&
         Object.keys(errors.value).length === 0
})

const selectShippingRate = (rate: ShippingRate) => {
  form.value.shippingPriority = rate.type
}

const validateForm = () => {
  errors.value = {}

  if (!form.value.fromName.trim()) {
    errors.value.fromName = 'Sender name is required'
  }
  if (!form.value.fromAddress.trim()) {
    errors.value.fromAddress = 'Sender address is required'
  }
  if (!form.value.fromPostCode.trim()) {
    errors.value.fromPostCode = 'Sender post code is required'
  }
  if (!form.value.toName.trim()) {
    errors.value.toName = 'Recipient name is required'
  }
  if (!form.value.toAddress.trim()) {
    errors.value.toAddress = 'Recipient address is required'
  }
  if (!form.value.toPostCode.trim()) {
    errors.value.toPostCode = 'Recipient post code is required'
  }
}

const generateTrackingNumber = () => {
  return 'BOLT' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

const handleSubmit = async () => {
  validateForm()
  
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const order: Order = {
      id: Date.now().toString(),
      fromName: form.value.fromName.trim(),
      fromAddress: form.value.fromAddress.trim(),
      fromPostCode: form.value.fromPostCode.trim(),
      toName: form.value.toName.trim(),
      toAddress: form.value.toAddress.trim(),
      toPostCode: form.value.toPostCode.trim(),
      shippingPriority: form.value.shippingPriority as 'standard' | 'express',
      price: selectedRate.value!.price,
      createdAt: new Date().toISOString(),
      trackingNumber: generateTrackingNumber(),
      status: 'pending'
    }

    emit('orderCreated', order)
    emit('showConfirmation', order)

    // Reset form
    form.value = {
      fromName: '',
      fromAddress: '',
      fromPostCode: '',
      toName: '',
      toAddress: '',
      toPostCode: '',
      shippingPriority: ''
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.order-section {
  max-width: 900px;
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

.order-form {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section h3 {
  color: #2563EB;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #E2E8F0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input.error {
  border-color: #EF4444;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: #EF4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.shipping-section {
  margin-bottom: 2rem;
}

.shipping-section h3 {
  color: #2563EB;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.shipping-options {
  display: grid;
  gap: 1rem;
}

.shipping-option {
  border: 2px solid #E5E7EB;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shipping-option:hover {
  border-color: #2563EB;
  background: #F8FAFC;
}

.shipping-option.selected {
  border-color: #2563EB;
  background: linear-gradient(135deg, #EBF4FF 0%, #DBEAFE 100%);
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.option-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.option-name {
  font-weight: 600;
  color: #1E293B;
}

.option-price {
  background: #F97316;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.option-delivery {
  color: #10B981;
  font-weight: 500;
}

.option-description {
  color: #64748B;
  margin: 0;
}

.order-summary {
  background: #F8FAFC;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.order-summary h3 {
  color: #2563EB;
  margin-bottom: 1rem;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-row.total {
  border-top: 2px solid #E2E8F0;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(37, 99, 235, 0.5);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .order-form {
    padding: 1rem;
  }

  .option-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>