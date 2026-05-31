import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { db, storage } from '../firebase'

import { collection, addDoc } from 'firebase/firestore'

import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'

export default function ReportIssue() {

  // Persistent Language
  const [language] = useState(
    localStorage.getItem('language') || 'en'
  )

  // Translations
  const translations = {

    en: {
      title: 'Report Road Issue',
      subtitle:
        'Upload road damage images and submit complaints directly to responsible authorities.',
      back: 'Back Home',
      upload: 'Upload Road Image',
      uploaded: 'Uploaded Image',
      change: 'Change Image',
      description: 'Issue Description',
      placeholder:
        'Describe potholes, cracks, waterlogging or other road issues...',
      location: 'Live Location',
      severity: 'Severity Level',
      submit: 'Submit Complaint',
      submitting: 'Submitting...',
      detecting: 'Detecting your live location...',
      success: 'Complaint Submitted Successfully ✅'
    },

    hi: {
      title: 'सड़क समस्या दर्ज करें',
      subtitle:
        'सड़क क्षति की तस्वीरें अपलोड करें और शिकायत सीधे संबंधित विभाग को भेजें।',
      back: 'होम पर वापस जाएँ',
      upload: 'सड़क की तस्वीर अपलोड करें',
      uploaded: 'अपलोड की गई तस्वीर',
      change: 'तस्वीर बदलें',
      description: 'समस्या का विवरण',
      placeholder:
        'गड्ढों, दरारों, जलभराव या अन्य सड़क समस्याओं का विवरण लिखें...',
      location: 'लाइव लोकेशन',
      severity: 'गंभीरता स्तर',
      submit: 'शिकायत दर्ज करें',
      submitting: 'सबमिट हो रहा है...',
      detecting: 'आपकी लाइव लोकेशन पता की जा रही है...',
      success: 'शिकायत सफलतापूर्वक दर्ज की गई ✅'
    }

  }

  const t = translations[language]

  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const [showPreview, setShowPreview] = useState(false)

  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [severity, setSeverity] = useState('Low')

  const [coordinates, setCoordinates] = useState(null)

  const [loading, setLoading] = useState(false)

  const [detectingLocation, setDetectingLocation] = useState(false)

  // Detect Live Location
  useEffect(() => {

    if (navigator.geolocation) {

      setDetectingLocation(true)

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          setCoordinates({
            latitude,
            longitude
          })

          try {

            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )

            const data = await response.json()

            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              'Unknown City'

            const state =
              data.address.state || ''

            const country =
              data.address.country || ''

            setLocation(
              `${city}, ${state}, ${country}`
            )

          } catch (error) {

            console.error(error)

            setLocation(
              `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
            )

          }

          setDetectingLocation(false)

        },

        (error) => {

          console.error(error)

          setDetectingLocation(false)

        }

      )

    }

  }, [])

  // Handle Image Upload
  const handleImageChange = (e) => {

    const file = e.target.files[0]

    if (file) {

      setImage(URL.createObjectURL(file))
      setImageFile(file)

    }

  }

  // Submit Complaint
  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!imageFile) {

      alert('Please upload an image')
      return

    }

    try {

      setLoading(true)

      // Upload Image
      const storageRef = ref(
        storage,
        `complaints/${Date.now()}-${imageFile.name}`
      )

      await uploadBytes(storageRef, imageFile)

      const imageUrl = await getDownloadURL(storageRef)

      // Save Complaint
      await addDoc(collection(db, 'complaints'), {

        imageUrl,
        description,
        location,
        severity,

        latitude: coordinates?.latitude || null,
        longitude: coordinates?.longitude || null,

        createdAt: new Date()

      })

      alert(t.success)

      // Reset Form
      setImage(null)
      setImageFile(null)

      setDescription('')
      setSeverity('Low')

    } catch (error) {

      console.error(error)

      alert('Something went wrong')

    } finally {

      setLoading(false)

    }

  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">

        <Link to="/">
          <h1 className="text-3xl font-bold text-green-400 cursor-pointer">
            RoadWatch
          </h1>
        </Link>

        <Link to="/">
          <button className="border border-slate-600 hover:bg-slate-800 px-5 py-2 rounded-lg font-semibold transition">
            {t.back}
          </button>
        </Link>

      </nav>

      {/* Main Content */}
      <section className="flex justify-center items-center py-20 px-6">

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 w-full max-w-2xl">

          <h2 className="text-5xl font-bold text-green-400 mb-4">
            {t.title}
          </h2>

          <p className="text-slate-300 mb-10">
            {t.subtitle}
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* Upload */}
            {!image ? (

              <div>

                <label className="block mb-3 text-lg text-slate-300">
                  {t.upload}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"
                />

              </div>

            ) : (

              <div>

                <div className="flex justify-between items-center mb-3">

                  <p className="text-lg text-slate-300">
                    {t.uploaded}
                  </p>

                  <label className="cursor-pointer text-green-400 hover:text-green-300">

                    {t.change}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>

                </div>

                <img
                  src={image}
                  alt="Preview"
                  onClick={() => setShowPreview(true)}
                  className="w-full h-80 object-cover rounded-2xl border border-slate-700 cursor-pointer hover:opacity-90 transition"
                />

              </div>

            )}

            {/* Description */}
            <div>

              <label className="block mb-3 text-lg text-slate-300">
                {t.description}
              </label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.placeholder}
                className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"
              ></textarea>

            </div>

            {/* Location */}
            <div>

              <label className="block mb-3 text-lg text-slate-300">
                {t.location}
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Detecting location..."
                className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"
              />

              {detectingLocation && (

                <p className="text-sm text-green-400 mt-2">
                  {t.detecting}
                </p>

              )}

            </div>

            {/* Severity */}
            <div>

              <label className="block mb-3 text-lg text-slate-300">
                {t.severity}
              </label>

              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"
              >

                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
                <option>Critical</option>

              </select>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 py-4 rounded-xl text-lg font-semibold transition"
            >
              {loading ? t.submitting : t.submit}
            </button>

          </form>

        </div>

      </section>

      {/* Fullscreen Preview */}
      {showPreview && (

        <div
          onClick={() => setShowPreview(false)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
        >

          <img
            src={image}
            alt="Full Preview"
            className="max-w-full max-h-full rounded-2xl"
          />

        </div>

      )}

    </div>
  )
}