import { useEffect, useState } from 'react'

import {
  collection,
  onSnapshot
} from 'firebase/firestore'

import { db } from '../firebase'

import {
  getOfflineComplaints
} from '../utils/offlineStorage'

export default function MyComplaints() {

  const [complaints, setComplaints] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [networkStatus, setNetworkStatus] =
    useState(
      navigator.onLine
        ? 'Online'
        : 'Offline'
    )
    const language =
  localStorage.getItem('language') || 'en'
  // NETWORK DETECTION
  useEffect(() => {

    const handleOnline = () => {

      setNetworkStatus('Online')

    }

    const handleOffline = () => {

      setNetworkStatus('Offline')

    }

    window.addEventListener(
      'online',
      handleOnline
    )

    window.addEventListener(
      'offline',
      handleOffline
    )

    return () => {

      window.removeEventListener(
        'online',
        handleOnline
      )

      window.removeEventListener(
        'offline',
        handleOffline
      )

    }

  }, [])

  // FETCH COMPLAINTS
  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, 'complaints'),

      (snapshot) => {

        // ONLINE COMPLAINTS
        const onlineComplaints =
          snapshot.docs.map((doc) => ({

            id: doc.id,

            ...doc.data(),

            source: 'Online'

          }))

        // OFFLINE COMPLAINTS
        const offlineComplaints =
          getOfflineComplaints().map(

            (complaint, index) => ({

              id:
                complaint.id ||
                `offline-${index}`,

              ...complaint,

              source: 'Offline',

              status:
                complaint.status ||
                'Pending Sync'

            })

          )

        // COMBINE BOTH
        const combinedComplaints = [

          ...offlineComplaints,

          ...onlineComplaints

        ]

        // SORT LATEST FIRST
        combinedComplaints.sort(

          (a, b) => {

            return new Date(
              b.createdAt || 0
            ) - new Date(
              a.createdAt || 0
            )

          }

        )

        setComplaints(
          combinedComplaints
        )

        setLoading(false)

      }

    )

    return () => unsubscribe()

  }, [])

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-bold text-green-400">
  {language === 'hi'
    ? 'मेरी शिकायतें'
    : 'My Complaints'}
</h1>

<p className="text-slate-400 mt-3">
  {language === 'hi'
    ? 'अपनी शिकायतों की स्थिति देखें'
    : 'Track your complaints live'}
</p>

        </div>

        {/* NETWORK */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4">

          <h3 className="text-lg font-semibold text-cyan-400">

            {
  language === 'hi'
    ? 'नेटवर्क स्थिति'
    : 'Network Status'
}

          </h3>

          <p
            className={`mt-2 font-semibold ${
              networkStatus === 'Online'
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >

            {
  networkStatus === 'Online'
    ? language === 'hi'
      ? 'ऑनलाइन'
      : 'Online'
    : language === 'hi'
    ? 'ऑफलाइन'
    : 'Offline'
}

          </p>

        </div>

      </div>

      {/* LOADING */}
      {loading && (

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">

          <h2 className="text-2xl text-slate-400">

            Loading complaints...

          </h2>

        </div>

      )}

      {/* EMPTY */}
      {!loading &&
        complaints.length === 0 && (

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">

          <h2 className="text-2xl text-slate-400">

            No complaints found

          </h2>

        </div>

      )}

      {/* COMPLAINT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {complaints.map((complaint) => (

          <div
            key={complaint.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:scale-[1.01] transition"
          >

            {/* USER IMAGE */}
            {complaint.imageUrl && (

              <img
                src={complaint.imageUrl}
                alt="Complaint"
                className="w-full h-64 object-cover"
              />

            )}

            {/* AI RESULT */}
            {complaint.resultImage && (

              <div className="p-5">

                <h3 className="text-green-400 text-lg font-semibold mb-3">

                  AI Detection Result

                </h3>

                <img
                  src={complaint.resultImage}
                  alt="AI Detection"
                  className="rounded-2xl border border-green-500"
                />

              </div>

            )}

            {/* CONTENT */}
            <div className="p-6 space-y-5">

              {/* SOURCE */}
              <div>

                <h3 className="text-cyan-400 text-xl font-semibold">

                  {
  language === 'hi'
    ? 'स्रोत'
    : 'Source'
}

                </h3>

                <p
                  className={`mt-2 font-semibold ${
                    complaint.source ===
                    'Offline'
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}
                >

                  {
  complaint.source === 'Offline'
    ? language === 'hi'
      ? 'ऑफलाइन'
      : 'Offline'
    : language === 'hi'
    ? 'ऑनलाइन'
    : 'Online'
}

                </p>

              </div>

              {/* AI */}
<div>

  <h3 className="text-green-400 text-xl font-semibold">

    {language === 'hi'
      ? 'एआई पहचान'
      : 'AI Detection'}

  </h3>

  <p className="text-slate-300 mt-2">

    {complaint.aiDetection
      ? complaint.aiDetection
      : language === 'hi'
      ? 'अज्ञात'
      : 'Unknown'}

  </p>

</div>

{/* DESCRIPTION */}
<div>

  <h3 className="text-blue-400 text-xl font-semibold">

    {language === 'hi'
      ? 'विवरण'
      : 'Description'}

  </h3>

  <p className="text-slate-300 mt-2">

    {complaint.description
      ? complaint.description
      : language === 'hi'
      ? 'कोई विवरण उपलब्ध नहीं'
      : 'No description'}

  </p>

</div>

{/* LOCATION */}
<div>

  <h3 className="text-yellow-400 text-xl font-semibold">

    {language === 'hi'
      ? 'स्थान'
      : 'Location'}

  </h3>

  <p className="text-slate-300 mt-2">

    {complaint.location
      ? complaint.location
      : language === 'hi'
      ? 'अज्ञात'
      : 'Unknown'}

  </p>

</div>

{/* SEVERITY */}
<div>

  <h3 className="text-red-400 text-xl font-semibold">

    {language === 'hi'
      ? 'गंभीरता स्तर'
      : 'Severity'}

  </h3>

  <p className="text-slate-300 mt-2">

    {complaint.severity
      ? language === 'hi'
        ? complaint.severity === 'Low'
          ? 'कम'
          : complaint.severity === 'Moderate'
          ? 'मध्यम'
          : complaint.severity === 'High'
          ? 'उच्च'
          : complaint.severity
        : complaint.severity
      : language === 'hi'
      ? 'कम'
      : 'Low'}

  </p>

</div>

{/* STATUS */}
<div>

  <h3 className="text-purple-400 text-xl font-semibold">

    {language === 'hi'
      ? 'शिकायत की स्थिति'
      : 'Complaint Status'}

  </h3>

  <p
    className={`mt-2 font-semibold text-xl ${
      complaint.status === 'Resolved'
        ? 'text-green-400'
        : complaint.status === 'In Progress'
        ? 'text-yellow-400'
        : 'text-red-400'
    }`}
  >

    {language === 'hi'
      ? complaint.status === 'Resolved'
        ? 'समाधान हो गया'
        : complaint.status === 'In Progress'
        ? 'कार्य प्रगति पर है'
        : complaint.status === 'Pending'
        ? 'लंबित'
        : complaint.status === 'Pending Sync'
        ? 'सिंक होना बाकी'
        : complaint.status
      : complaint.status || 'Pending'}

  </p>

</div>

{/* CREATED */}
<div>

  <h3 className="text-orange-400 text-xl font-semibold">

    {language === 'hi'
      ? 'बनाने की तिथि'
      : 'Created At'}

  </h3>

  <p className="text-slate-300 mt-2">

    {complaint.createdAt

      ? typeof complaint.createdAt === 'string'

        ? new Date(
            complaint.createdAt
          ).toLocaleDateString(
            language === 'hi'
              ? 'hi-IN'
              : 'en-IN',
            {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }
          )

        : complaint.createdAt.seconds

        ? new Date(
            complaint.createdAt.seconds *
            1000
          ).toLocaleDateString(
            language === 'hi'
              ? 'hi-IN'
              : 'en-IN',
            {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }
          )

        : language === 'hi'
        ? 'अज्ञात'
        : 'Unknown'

      : language === 'hi'
      ? 'अज्ञात'
      : 'Unknown'}

  </p>

</div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}