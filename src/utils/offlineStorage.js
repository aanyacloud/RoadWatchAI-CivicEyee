const STORAGE_KEY = 'offlineComplaints'

// GET OFFLINE COMPLAINTS
export const getOfflineComplaints = () => {
  try {
    return (
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      ) || []
    )
  } catch (error) {
    console.error(
      'Error reading offline complaints:',
      error
    )

    return []
  }
}

// SAVE OFFLINE COMPLAINT
export const saveOfflineComplaint = (
  complaint
) => {
  try {
    const existingComplaints =
      getOfflineComplaints()

    const offlineComplaint = {
      ...complaint,

      id: `offline-${Date.now()}`,

      source: 'Offline',

      status:
        complaint.status ||
        'Pending Sync',

      createdAt:
        complaint.createdAt ||
        new Date().toISOString(),
    }

    existingComplaints.push(
      offlineComplaint
    )

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        existingComplaints
      )
    )

    console.log(
      'Offline complaint saved successfully'
    )

    return true
  } catch (error) {
    console.error(
      'Error saving offline complaint:',
      error
    )

    return false
  }
}

// REMOVE OFFLINE COMPLAINT
export const removeOfflineComplaint = (
  id
) => {
  try {
    const complaints =
      getOfflineComplaints()

    const updatedComplaints =
      complaints.filter(
        (complaint) =>
          complaint.id !== id
      )

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        updatedComplaints
      )
    )
  } catch (error) {
    console.error(
      'Error removing complaint:',
      error
    )
  }
}

// CLEAR ALL OFFLINE COMPLAINTS
export const clearOfflineComplaints =
  () => {
    try {
      localStorage.removeItem(
        STORAGE_KEY
      )
    } catch (error) {
      console.error(
        'Error clearing offline complaints:',
        error
      )
    }
  }

// SYNC OFFLINE COMPLAINTS
export const syncOfflineComplaints =
  async () => {
    try {
      const complaints =
        getOfflineComplaints()

      if (
        complaints.length === 0
      ) {
        console.log(
          'No offline complaints to sync'
        )

        return
      }

      console.log(
        'Syncing offline complaints:',
        complaints
      )

      // Firebase sync logic can be added here later

    } catch (error) {
      console.error(
        'Error syncing offline complaints:',
        error
      )
    }
  }