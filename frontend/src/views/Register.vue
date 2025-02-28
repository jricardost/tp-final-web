<template>
  <div class="register-container">
    <h1>Cadastre-se</h1>
    <form @submit.prevent="submitForm">
      <div
        class="form-group"
        v-for="field in fields"
        :key="field.id"
      >
        <FloatLabel>
          <InputText
            :id="field.id"
            :type="field.type"
            v-model="formData[field.model]"
            :required="field.required"
          />
          <label :for="field.id">{{ field.label }}</label>
        </FloatLabel>
      </div>
      <Button type="submit">Cadastra-se</Button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import FloatLabel from 'primevue/floatlabel'

const defaultFormData = {
  username: '',
  email: '',
  password: '',
}

const formData = reactive({ ...defaultFormData })

const fields = [
  { id: 'username', label: 'Nome', type: 'text', model: 'username', required: true },
  { id: 'email', label: 'Email', type: 'email', model: 'email', required: true },
  { id: 'password', label: 'Senha', type: 'password', model: 'password', required: true },
]

async function submitForm() {
  console.log(JSON.stringify(formData))
  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const data = await response.json()
    console.log('Success:', data)
    resetForm()
  } catch (error) {
    console.error('Error:', error)
  }
}

function resetForm() {
  Object.assign(formData, defaultFormData)
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 8px;
}

.register-container h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 30px;
}

::v-deep label {
  font-size: 1rem;
  color: #666;
}

Button {
  display: block;
  width: 100%;
  margin-top: 20px;
}
</style>