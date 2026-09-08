import nextEnv from '@next/env'
import mongoose from 'mongoose'

const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

const mongodbUri = process.env.MONGODB_URI?.trim()
const defaultCurrency = (process.env.DEFAULT_SALE_CURRENCY ?? 'BRL').trim().toUpperCase()
const isDryRun = process.env.MIGRATION_DRY_RUN !== 'false'
const supportedCurrencies = new Set(['BRL', 'EUR'])

if (!mongodbUri) {
  throw new Error('MONGODB_URI is not defined. Add it to .env.local or set it in the shell.')
}

if (!mongodbUri.startsWith('mongodb://') && !mongodbUri.startsWith('mongodb+srv://')) {
  throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://')
}

if (!defaultCurrency) {
  throw new Error('DEFAULT_SALE_CURRENCY is not defined')
}

if (!supportedCurrencies.has(defaultCurrency)) {
  throw new Error(`DEFAULT_SALE_CURRENCY must be one of: ${[...supportedCurrencies].join(', ')}`)
}

const missingCurrencyFilter = {
  $or: [
    { currencyCurrencyAccount: { $exists: false } },
    { currencyCurrencyAccount: null },
    { currencyCurrencyAccount: '' },
  ],
}

try {
  await mongoose.connect(mongodbUri)

  const salesCollection = mongoose.connection.collection('sale')
  const documentsToUpdate = await salesCollection.countDocuments(missingCurrencyFilter)

  if (isDryRun) {
    console.log(`Dry run: ${documentsToUpdate} sale document(s) would receive ${defaultCurrency}.`)
  } else {
    const result = await salesCollection.updateMany(missingCurrencyFilter, {
      $set: { currencyCurrencyAccount: defaultCurrency },
    })

    console.log(`Updated ${result.modifiedCount} sale document(s) with ${defaultCurrency}.`)
  }
} finally {
  await mongoose.disconnect()
}