import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet'

import L from 'leaflet'

import { db } from '../firebase'

import {
  getOfflineComplaints,
  syncOfflineComplaints
} from '../utils/offlineStorage'

// FIX LEAFLET ICONS
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

})

// AUTO RECENTER MAP
function RecenterMap({ location }) {

  const map = useMap()

  useEffect(() => {

    map.setView(location, 13)

  }, [location, map])

  return null

}

// SEVERITY ICONS
const greenIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41]

})

const yellowIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41]

})

const orangeIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41]

})

const redIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41]

})

export default function AuthorityDashboard() {

  const language =
    localStorage.getItem('language') || 'en'

  const [complaints, setComplaints] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [selectedImage, setSelectedImage] =
    useState(null)

  const [networkStatus, setNetworkStatus] =
    useState(
      navigator.onLine
        ? 'Online'
        : 'Offline'
    )

  // AUTO LOCATION
  const [userLocation, setUserLocation] =
    useState([21.1938, 81.3509])

  // GET USER LOCATION
  useEffect(() => {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(

        (position) => {

          setUserLocation([

            position.coords.latitude,

            position.coords.longitude

          ])

        },

        (error) => {

          console.log(error)

        }

      )

    }

  }, [])

  // NETWORK DETECTION
  useEffect(() => {

    const handleOnline = async () => {

      setNetworkStatus('Online')

      await syncOfflineComplaints()

      loadComplaints()

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

  // LOAD COMPLAINTS
  const loadComplaints = () => {

    const unsubscribe = onSnapshot(

      collection(db, 'complaints'),

      (snapshot) => {

        const onlineComplaints =
          snapshot.docs.map((doc) => ({

            id: doc.id,

            ...doc.data(),

            source: 'Online'

          }))

        const offlineComplaints =
          getOfflineComplaints().map(

            (complaint) => ({

              ...complaint,

              source: 'Offline',

              status:
                complaint.status ||
                'Pending Sync'

            })

          )

        const combinedComplaints = [

          ...offlineComplaints,

          ...onlineComplaints

        ]

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

    return unsubscribe

  }

  // INITIAL LOAD
  useEffect(() => {

    const unsubscribe =
      loadComplaints()

    return () => {

      if (unsubscribe)
        unsubscribe()

    }

  }, [])

  // UPDATE STATUS
  const updateStatus = async (

    id,
    newStatus,
    source

  ) => {

    try {

      if (source === 'Online') {

        const complaintRef =
          doc(
            db,
            'complaints',
            id
          )

        await updateDoc(
          complaintRef,
          {
            status: newStatus
          }
        )

      }

      setComplaints((prev) =>

        prev.map((complaint) => {

          if (
            complaint.id === id
          ) {

            return {

              ...complaint,

              status:
                newStatus

            }

          }

          return complaint

        })

      )

    } catch (error) {

      console.error(error)

    }

  }

  // STATS
  const totalComplaints =
    complaints.length

  const pendingCount =
    complaints.filter(
      (c) =>
        c.status !== 'Resolved'
    ).length

  const resolvedCount =
    complaints.filter(
      (c) =>
        c.status === 'Resolved'
    ).length

  const highSeverityCount =
    complaints.filter(
      (c) =>
        c.severity === 'High'
    ).length

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">

        <div>

          <h1 className="text-6xl font-bold text-green-400">

            {language === 'hi'
              ? 'प्राधिकरण डैशबोर्ड'
              : 'Authority Dashboard'}

          </h1>

          <p className="text-slate-400 mt-4 text-xl">

            {language === 'hi'
              ? 'सड़क शिकायतों की निगरानी और समाधान'
              : 'Monitor and resolve road complaints'}

          </p>

        </div>

        {/* NETWORK */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl px-8 py-5">

          <h3 className="text-xl font-bold text-cyan-400">

            {language === 'hi'
              ? 'नेटवर्क स्थिति'
              : 'Network Status'}

          </h3>

          <p
            className={`mt-3 text-lg font-bold ${
              networkStatus === 'Online'
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >

            {networkStatus === 'Online'
              ? (language === 'hi' ? 'ऑनलाइन' : 'Online')
              : (language === 'hi' ? 'ऑफलाइन' : 'Offline')}

          </p>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

        {/* TOTAL */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold text-cyan-400">

            {language === 'hi'
              ? 'कुल शिकायतें'
              : 'Total Complaints'}

          </h2>

          <p className="text-5xl font-bold mt-5">

            {totalComplaints}

          </p>

        </div>

        {/* PENDING */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold text-yellow-400">

            {language === 'hi'
              ? 'लंबित'
              : 'Pending'}

          </h2>

          <p className="text-5xl font-bold mt-5">

            {pendingCount}

          </p>

        </div>

        {/* RESOLVED */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold text-green-400">

            {language === 'hi'
              ? 'समाधान'
              : 'Resolved'}

          </h2>

          <p className="text-5xl font-bold mt-5">

            {resolvedCount}

          </p>

        </div>

        {/* HIGH */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold text-red-400">

            {language === 'hi'
              ? 'उच्च गंभीरता'
              : 'High Severity'}

          </h2>

          <p className="text-5xl font-bold mt-5">

            {highSeverityCount}

          </p>

        </div>

      </div>

      {/* LIVE MAP */}
      <div className="mb-12">

        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">

          <MapContainer
            center={userLocation}
            zoom={13}
            style={{
              height: '500px',
              width: '100%'
            }}
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap
              location={userLocation}
            />

            {/* USER LOCATION */}
            <Marker position={userLocation}>

              <Popup>

                📍 {language === 'hi'
                  ? 'वर्तमान प्राधिकरण स्थान'
                  : 'Current Authority Location'}

              </Popup>

            </Marker>

            {/* COMPLAINT MARKERS */}
            {complaints.map((complaint) => (

              <Marker
                key={complaint.id}

                icon={
                  complaint.severity === 'Low'
                    ? greenIcon
                    : complaint.severity === 'Moderate'
                    ? yellowIcon
                    : complaint.severity === 'High'
                    ? orangeIcon
                    : redIcon
                }

                position={[

                  complaint.latitude ||
                    userLocation[0],

                  complaint.longitude ||
                    userLocation[1]

                ]}
              >

                <Popup>

                  <div className="w-72">

                    {complaint.imageUrl && (

                      <img
                        src={complaint.imageUrl}
                        alt="Complaint"
                        className="w-full h-40 object-cover rounded-xl mb-3"
                      />

                    )}

                    <h2 className="text-xl font-bold mb-2">

                      {complaint.severity || 'Unknown'} Severity

                    </h2>

                    <p className="mb-2">

                      {complaint.description || 'No Description'}

                    </p>

                    <p className="text-sm text-gray-600 mb-2">

                      📍 {complaint.location || 'Unknown'}

                    </p>

                    <p className="font-bold">

                      Status:
                      <span className="ml-2 text-green-600">

                        {complaint.status || 'Pending'}

                      </span>

                    </p>

                  </div>

                </Popup>

              </Marker>

            ))}

          </MapContainer>

        </div>

      </div>

      {/* LOADING */}
      {loading && (

        <div className="bg-slate-900 rounded-3xl p-10 text-center">

          <h2 className="text-2xl text-slate-400">

            {language === 'hi'
              ? 'शिकायतें लोड हो रही हैं...'
              : 'Loading complaints...'}

          </h2>

        </div>

      )}

      {/* COMPLAINT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {complaints.map((complaint) => (

          <div
            key={complaint.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
          >

            {/* IMAGE */}
            {complaint.imageUrl && (

              <img
                src={complaint.imageUrl}
                alt="Complaint"
                onClick={() =>
                  setSelectedImage(
                    complaint.imageUrl
                  )
                }
                className="w-full h-72 object-cover cursor-pointer hover:scale-105 transition"
              />

            )}

            {/* CONTENT */}
            <div className="p-7 space-y-5">

              {/* DESCRIPTION */}
              <div>

                <h3 className="text-cyan-400 text-2xl font-bold">

                  Description

                </h3>

                <p className="text-slate-300 mt-3 text-lg">

                  {complaint.description ||
                    'No description'}

                </p>

              </div>

              {/* LOCATION */}
              <div>

                <h3 className="text-yellow-400 text-2xl font-bold">

                  Location

                </h3>

                <p className="text-slate-300 mt-3 text-lg">

                  📍 {complaint.location ||
                    'Unknown'}

                </p>

              </div>

              {/* SEVERITY */}
              <div>

                <h3 className="text-red-400 text-2xl font-bold">

                  Severity

                </h3>

                <p className="text-slate-300 mt-3 text-lg">

                  {complaint.severity ||
                    'Low'}

                </p>

              </div>

              {/* STATUS */}
              <div>

                <h3 className="text-purple-400 text-2xl font-bold">

                  Status

                </h3>

                <p
                  className={`mt-3 text-lg font-bold ${
                    complaint.status ===
                    'Resolved'
                      ? 'text-green-400'
                      : complaint.status ===
                        'In Progress'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >

                  {complaint.status ||
                    'Pending'}

                </p>

              </div>

              {/* SOURCE */}
              <div>

                <h3 className="text-green-400 text-2xl font-bold">

                  Source

                </h3>

                <p className="text-slate-300 mt-3 text-lg">

                  {complaint.source}

                </p>

              </div>

              {/* CREATED TIME */}
              <div>

                <h3 className="text-orange-400 text-2xl font-bold">

                  Created Time

                </h3>

                <p className="text-slate-300 mt-3 text-lg">

                  {
                    complaint.createdAt

                      ? complaint.createdAt.seconds

                        ? new Date(
                            complaint.createdAt.seconds * 1000
                          ).toLocaleString(
                            language === 'hi'
                              ? 'hi-IN'
                              : 'en-IN'
                          )

                        : new Date(
                            complaint.createdAt
                          ).toLocaleString(
                            language === 'hi'
                              ? 'hi-IN'
                              : 'en-IN'
                          )

                      : language === 'hi'
                        ? 'उपलब्ध नहीं'
                        : 'Not Available'
                  }

                </p>

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-5">

                <button
                  onClick={() =>
                    updateStatus(
                      complaint.id,
                      'In Progress',
                      complaint.source
                    )
                  }
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 transition py-4 rounded-2xl font-bold text-lg"
                >

                  In Progress

                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      complaint.id,
                      'Resolved',
                      complaint.source
                    )
                  }
                  className="flex-1 bg-green-500 hover:bg-green-600 transition py-4 rounded-2xl font-bold text-lg"
                >

                  Resolve

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* FULLSCREEN IMAGE */}
      {selectedImage && (

        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() =>
            setSelectedImage(null)
          }
        >

          <img
            src={selectedImage}
            alt="Fullscreen"
            className="max-w-[90%] max-h-[90%] rounded-3xl shadow-2xl"
          />

        </div>

      )}

    </div>

  )

}