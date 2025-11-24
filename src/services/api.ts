const API_BASE_URL = 'http://localhost:5000'

export interface MemberFromDB {
  member_id: number
  family_name: string
  age_group: string
  role: string
}

export async function fetchMembersFromDB(): Promise<MemberFromDB[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/members`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching members from database:', error)
    throw error
  }
}
