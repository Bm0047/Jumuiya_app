import { Member } from '../types'

// AfricaTalking API Configuration
const AFRICASTALKING_USERNAME = (import.meta as any).env?.VITE_AFRICASTALKING_USERNAME || 'sandbox'
const AFRICASTALKING_API_KEY = (import.meta as any).env?.VITE_AFRICASTALKING_API_KEY || ''
const AFRICASTALKING_SMS_URL = 'https://api.africastalking.com/version1/messaging'
const AFRICASTALKING_WHATSAPP_URL = 'https://api.africastalking.com/version1/messaging'

export interface SMSMessage {
  id: string
  to: string[]
  message: string
  from?: string
  bulkSMSMode?: number
  enqueue?: number
  keyword?: string
  linkId?: string
  retryDurationInHours?: number
}

export interface WhatsAppMessage {
  id: string
  to: string
  message: string
  from?: string
}

export interface MessageResponse {
  SMSMessageData: {
    Message: string
    Recipients: Array<{
      statusCode: number
      number: string
      status: string
      cost: string
      messageId: string
    }>
  }
}

export interface WhatsAppResponse {
  status: string
  description: string
  messageId?: string
}

// SMS Functions
export async function sendSMS(message: SMSMessage): Promise<MessageResponse> {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'apiKey': AFRICASTALKING_API_KEY,
    'username': AFRICASTALKING_USERNAME
  }

  const body = new URLSearchParams({
    username: AFRICASTALKING_USERNAME,
    to: message.to.join(','),
    message: message.message,
    from: message.from || 'MariaMagdalena',
    bulkSMSMode: (message.bulkSMSMode || 1).toString(),
    enqueue: (message.enqueue || 1).toString(),
    ...(message.keyword && { keyword: message.keyword }),
    ...(message.linkId && { linkId: message.linkId }),
    ...(message.retryDurationInHours && { retryDurationInHours: message.retryDurationInHours.toString() })
  })

  const response = await fetch(AFRICASTALKING_SMS_URL, {
    method: 'POST',
    headers,
    body: body.toString()
  })

  if (!response.ok) {
    throw new Error(`SMS sending failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// WhatsApp Functions
export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'apiKey': AFRICASTALKING_API_KEY,
    'username': AFRICASTALKING_USERNAME
  }

  const body = {
    username: AFRICASTALKING_USERNAME,
    to: message.to,
    message: message.message,
    from: message.from || 'MariaMagdalena'
  }

  const response = await fetch(AFRICASTALKING_WHATSAPP_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`WhatsApp sending failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Utility Functions
export function getMembersByGroup(members: Member[], group: string): Member[] {
  return members.filter(member => member.group === group)
}

export function getMembersWithPhoneNumbers(members: Member[]): Member[] {
  return members.filter(member => member.phoneNumber || member.whatsappNumber)
}

export function getSMSRecipients(members: Member[]): string[] {
  return members
    .filter(member => member.phoneNumber)
    .map(member => member.phoneNumber!)
    .filter(phone => phone.trim() !== '')
}

export function getWhatsAppRecipients(members: Member[]): string[] {
  return members
    .filter(member => member.whatsappNumber)
    .map(member => member.whatsappNumber!)
    .filter(phone => phone.trim() !== '')
}

// Bulk messaging functions
export async function sendBulkSMS(members: Member[], message: string, group?: string): Promise<MessageResponse> {
  let targetMembers = members

  if (group) {
    targetMembers = getMembersByGroup(members, group)
  }

  const recipients = getSMSRecipients(targetMembers)

  if (recipients.length === 0) {
    throw new Error('No members with phone numbers found for SMS')
  }

  return sendSMS({
    id: `sms-${Date.now()}`,
    to: recipients,
    message: message,
    from: 'MariaMagdalena'
  })
}

export async function sendBulkWhatsApp(members: Member[], message: string, group?: string): Promise<WhatsAppResponse[]> {
  let targetMembers = members

  if (group) {
    targetMembers = getMembersByGroup(members, group)
  }

  const recipients = getWhatsAppRecipients(targetMembers)

  if (recipients.length === 0) {
    throw new Error('No members with WhatsApp numbers found')
  }

  const promises = recipients.map(recipient =>
    sendWhatsAppMessage({
      id: `wa-${Date.now()}-${recipient}`,
      to: recipient,
      message: message,
      from: 'MariaMagdalena'
    })
  )

  return Promise.all(promises)
}

// Message logging interface
export interface MessageLog {
  id: string
  type: 'SMS' | 'WhatsApp'
  message: string
  recipients: string[]
  group?: string
  sentBy: string
  sentAt: Date
  status: 'success' | 'partial' | 'failed'
  response?: any
}

// Local storage for message logs (in production, this should be stored in Firestore)
const MESSAGE_LOGS_KEY = 'message_logs'

export function saveMessageLog(log: MessageLog): void {
  const logs = getMessageLogs()
  logs.push(log)
  localStorage.setItem(MESSAGE_LOGS_KEY, JSON.stringify(logs))
}

export function getMessageLogs(): MessageLog[] {
  const stored = localStorage.getItem(MESSAGE_LOGS_KEY)
  if (!stored) return []

  try {
    const logs = JSON.parse(stored)
    return logs.map((log: any) => ({
      ...log,
      sentAt: new Date(log.sentAt)
    }))
  } catch {
    return []
  }
}
