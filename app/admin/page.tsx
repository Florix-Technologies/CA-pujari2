'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/hooks/useTheme'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Edit2, Plus, RefreshCw, Eye, EyeOff, MessageSquare, Phone, ExternalLink, Users, BarChart3, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, stagger } from '@/lib/animations'

// Safe date formatter
function safeFormatDate(dateStr?: string): string {
  if (!dateStr) return 'TBA'
  try {
    return new Date(dateStr).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

type Course = {
  id?: string
  title: string
  description?: string
  duration?: string
  level?: string
  modules?: number
  price?: string
  students_count?: number
}

type Webinar = {
  id?: string
  title: string
  description?: string
  starts_at?: string
  duration_minutes?: number
  platform?: string
  price?: string
  seats?: number
  service_category?: string
}

type NSEProgram = {
  id?: string
  title: string
  price: string
  badge_label?: string
  category?: string
  description?: string
  duration?: string
  sessions?: string
}

type Inquiry = {
  id: string
  full_name: string
  email: string
  phone_number?: string
  company?: string
  message: string
  service_interested?: string
  created_at: string
}

type Booking = {
  id: string
  full_name: string
  email: string
  phone_number?: string
  service_type: string
  tier_name: string
  price: number
  booking_status: string
  created_at: string
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const { isLight } = useTheme()
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [nsePrograms, setNsePrograms] = useState<NSEProgram[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, type: 'webinar' | 'nse' | 'course', title: string } | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null)
  const [editingNSE, setEditingNSE] = useState<NSEProgram | null>(null)
  
  const [courseForm, setCourseForm] = useState<Course>({ title: '', description: '', duration: '', level: 'Beginner', modules: 0, price: '' })
  const [webinarForm, setWebinarForm] = useState<Webinar>({ title: '', description: '', starts_at: '', duration_minutes: 60, platform: 'Zoom', price: '', seats: 500, service_category: 'webinar' })
  const [nseForm, setNseForm] = useState<NSEProgram>({ title: '', price: '', badge_label: '', category: 'foundational', description: '', duration: '', sessions: '' })
  
  const [submitLoading, setSubmitLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Load courses and webinars
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [coursesRes, webinarsRes, nseRes, inquiriesRes, bookingsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/admin/webinars'), // Use admin route for category info
        fetch('/api/admin/nse'),
        fetch('/api/admin/inquiries'),
        fetch('/api/admin/bookings'),
      ])

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        const coursesList = Array.isArray(coursesData.data) ? coursesData.data : (Array.isArray(coursesData) ? coursesData : [])
        setCourses(coursesList)
      }

      if (webinarsRes.ok) {
        const webinarsData = await webinarsRes.json()
        const webinarsList = Array.isArray(webinarsData.data) ? webinarsData.data : (Array.isArray(webinarsData) ? webinarsData : [])
        setWebinars(webinarsList)
      }

      if (nseRes.ok) {
        const nseData = await nseRes.json()
        const nseList = Array.isArray(nseData.data) ? nseData.data : (Array.isArray(nseData) ? nseData : [])
        setNsePrograms(nseList)
      }

      if (inquiriesRes.ok) {
        const inqData = await inquiriesRes.json()
        setInquiries(Array.isArray(inqData.data) ? inqData.data : (Array.isArray(inqData) ? inqData : []))
      }

      if (bookingsRes.ok) {
        const bookData = await bookingsRes.json()
        setBookings(Array.isArray(bookData.data) ? bookData.data : (Array.isArray(bookData) ? bookData : []))
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to load data', err)
      setError(`Error loading data: ${err.message}`)
    }
    setLoading(false)
  }

  // COURSE HANDLERS
  async function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault()
    setSubmitLoading(true)
    setMessage('')

    try {
      if (editingCourse?.id) {
        // Update course
        const res = await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseForm),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to update course')
        }

        setMessage('✅ Course updated successfully')
        setEditingCourse(null)
      } else {
        // Create course
        const res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseForm),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to create course')
        }

        setMessage('✅ Course created successfully')
      }

      setCourseForm({ title: '', description: '', duration: '', level: 'Beginner', modules: 0, price: '' })
      loadData()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  async function handleDeleteCourse(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to delete course')
      }

      setMessage('✅ Course deleted successfully')
      loadData()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    }
  }

  // WEBINAR HANDLERS
  async function handleCreateWebinar(e: React.FormEvent) {
    e.preventDefault()
    setSubmitLoading(true)
    setMessage('')

    try {
      // Normalize date if present
      let finalForm = { ...webinarForm }
      if (finalForm.starts_at) {
        try {
          const date = new Date(finalForm.starts_at)
          if (!isNaN(date.getTime())) {
            finalForm.starts_at = date.toISOString()
          }
        } catch (e) {
          console.error("Date normalization failed", e)
        }
      }

      if (editingWebinar?.id) {
        // Update webinar
        const res = await fetch('/api/admin/webinars', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingWebinar.id, ...finalForm }),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to update webinar')
        }

        setMessage('✅ Webinar updated successfully')
        setEditingWebinar(null)
      } else {
        // Create webinar
        const res = await fetch('/api/admin/webinars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalForm),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to create webinar')
        }

        setMessage('✅ Webinar created successfully')
      }

      setWebinarForm({ title: '', description: '', starts_at: '', duration_minutes: 60, platform: 'Zoom', price: '', seats: 500 })
      loadData()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  async function handleDeleteWebinar(id: string) {
    try {
      const res = await fetch(`/api/admin/webinars?id=${id}`, { method: 'DELETE' })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to delete webinar')
      }

      setMessage('✅ Webinar deleted successfully')
      loadData()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    }
  }

  // NSE HANDLERS
  async function handleCreateNSE(e: React.FormEvent) {
    e.preventDefault()
    setSubmitLoading(true)
    setMessage('')

    try {
      if (editingNSE?.id) {
        const res = await fetch('/api/admin/nse', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingNSE.id, ...nseForm }),
        })
        if (!res.ok) throw new Error('Failed to update NSE program')
        setMessage('✅ NSE program updated')
        setEditingNSE(null)
      } else {
        const res = await fetch('/api/admin/nse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nseForm),
        })
        if (!res.ok) throw new Error('Failed to create NSE program')
        setMessage('✅ NSE program created')
      }
      setNseForm({ title: '', price: '', badge_label: '', category: 'foundational', description: '', duration: '', sessions: '' })
      loadData()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  async function handleDeleteNSE(id: string) {
    try {
      const res = await fetch(`/api/admin/nse?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setMessage('✅ NSE program deleted')
      loadData()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    }
  }

  // Generic delete trigger
  function triggerDelete(id: string, type: 'webinar' | 'nse' | 'course', title: string) {
    setDeleteConfirm({ id, type, title })
  }

  async function confirmDelete() {
    if (!deleteConfirm) return
    const { id, type } = deleteConfirm
    setDeleteConfirm(null)
    
    if (type === 'webinar') await handleDeleteWebinar(id)
    else if (type === 'nse') await handleDeleteNSE(id)
    else if (type === 'course') await handleDeleteCourse(id)
  }

  // PRIVACY MASKING UTILS
  function maskEmail(email?: string) {
    if (!email) return 'N/A'
    const [name, domain] = email.split('@')
    if (name.length <= 2) return `**@${domain}`
    return `${name.substring(0, 2)}***@${domain}`
  }

  function maskPhone(phone?: string) {
    if (!phone) return 'N/A'
    if (phone.length < 4) return '*******'
    return `${phone.substring(0, 2)}******${phone.substring(phone.length - 2)}`
  }

  function toggleReveal(id: string) {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // STATS AGGREGATION (True data from bookings table)
  const totalWebinarRegs = bookings.filter(b => b.service_type === 'Webinar').length
  const totalNSERegs = bookings.filter(b => b.service_type === 'NSE').length
  const totalCourseRegs = bookings.filter(b => b.service_type === 'Course').length

  // Fallback demo data
  const fallbackCourses: Course[] = [
    { id: '1', title: 'Trading Fundamentals', description: 'Learn the foundations of stock market trading.', duration: '4 weeks', level: 'Beginner', modules: 12, price: '₹4,999', students_count: 2500 },
    { id: '2', title: 'Technical Analysis Mastery', description: 'Read charts like a professional.', duration: '6 weeks', level: 'Beginner', modules: 18, price: '₹7,999', students_count: 1800 },
  ]

  const fallbackWebinars: Webinar[] = [
    { id: '1', title: 'Stock Market Basics for Beginners', description: 'Learn how stock markets work.', starts_at: '2026-04-15T19:00:00', duration_minutes: 90, platform: 'Zoom', price: 'Free', seats: 500 },
    { id: '2', title: 'Candlestick Patterns That Work', description: 'Professional trading patterns explained.', starts_at: '2026-04-22T19:00:00', duration_minutes: 120, platform: 'Google Meet', price: '₹299', seats: 300 },
  ]

  if (authLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading admin panel...</p>
        </div>
      </>
    )
  }

  if (!user) {
    return null
  }

  // Use fallback data if API returns empty
  const displayCourses = courses.length > 0 ? courses : fallbackCourses
  const displayWebinars = webinars.length > 0 ? webinars : fallbackWebinars

  return (
    <>
      <Navigation />

      <div 
        className="min-h-screen pt-32 pb-16"
        style={{
          backgroundColor: isLight ? '#F7F2E8' : '#0F172A',
        }}
      >
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-6">
          <motion.h1 
            variants={fadeUp} 
            className="text-4xl font-bold mb-2"
            style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            variants={fadeUp} 
            style={{ color: isLight ? '#A38970' : '#CBD5E1' }}
            className="mb-8"
          >
            Manage courses and webinars
          </motion.p>

          {/* STATS HUD */}
          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B' }} className="border-l-4 border-l-[#D1AF62] shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-70">True Course Enrollments</CardTitle>
                <Users className="w-4 h-4 text-[#D1AF62]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCourseRegs.toLocaleString()}</div>
                <p className="text-[10px] opacity-50 mt-1">Verified from bookings table</p>
              </CardContent>
            </Card>
            <Card style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B' }} className="border-l-4 border-l-primary shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-70">Webinar signups</CardTitle>
                <BarChart3 className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWebinarRegs.toLocaleString()}</div>
                <p className="text-[10px] opacity-50 mt-1">Verified from bookings table</p>
              </CardContent>
            </Card>
            <Card style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B' }} className="border-l-4 border-l-blue-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-70">NSE Enrollments</CardTitle>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalNSERegs.toLocaleString()}</div>
                <p className="text-[10px] opacity-50 mt-1">Verified from bookings table</p>
              </CardContent>
            </Card>
          </motion.div>

          {message && (
            <motion.div 
              variants={fadeUp} 
              className="mb-6 p-4 rounded-lg"
              style={{
                backgroundColor: isLight ? '#F7F2E8' : '#0F172A',
                borderColor: isLight ? '#E0D5C7' : '#334155',
                color: isLight ? '#3E3730' : '#E0E7FF',
              }}
            >
              {message}
            </motion.div>
          )}

          {error && (
            <motion.div 
              variants={fadeUp} 
              className="mb-6 p-4 border rounded-lg"
              style={{
                backgroundColor: isLight ? '#FEE2E2' : '#7F1D1D',
                borderColor: isLight ? '#FCA5A5' : '#DC2626',
                color: isLight ? '#991B1B' : '#FECACA',
              }}
            >
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
              <Button onClick={loadData} variant="outline" size="sm" className="mt-2">
                Retry
              </Button>
            </motion.div>
          )}

          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="mb-8 w-full grid w-full grid-cols-4">
              <TabsTrigger value="courses" className="w-full">Courses ({courses.length})</TabsTrigger>
              <TabsTrigger value="webinars" className="w-full">Webinars ({webinars.length})</TabsTrigger>
              <TabsTrigger value="nse" className="w-full">NSE ({nsePrograms.length})</TabsTrigger>
              <TabsTrigger value="leads" className="w-full">Leads ({inquiries.length + bookings.length})</TabsTrigger>
            </TabsList>

            {/* ===== COURSES TAB ===== */}
            <TabsContent value="courses" className="space-y-8 min-h-screen">
              {/* Course Form */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <Card
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                    borderColor: isLight ? '#E0D5C7' : '#334155',
                  }}
                >
                  <CardHeader>
                    <CardTitle style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
                      {editingCourse ? 'Edit Course' : 'Create New Course'}
                    </CardTitle>
                    <CardDescription style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
                      Fill in the course details below
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Trading Fundamentals"
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="level">Level</Label>
                          <Input
                            id="level"
                            placeholder="e.g., Beginner"
                            value={courseForm.level}
                            onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Course description"
                          value={courseForm.description}
                          onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            placeholder="e.g., 4 weeks"
                            value={courseForm.duration}
                            onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="modules">Modules</Label>
                          <Input
                            id="modules"
                            type="number"
                            placeholder="e.g., 12"
                            value={courseForm.modules}
                            onChange={(e) => setCourseForm({ ...courseForm, modules: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            placeholder="e.g., ₹4,999"
                            value={courseForm.price}
                            onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit" disabled={submitLoading}>
                          {editingCourse ? 'Update Course' : 'Create Course'}
                        </Button>
                        {editingCourse && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingCourse(null)
                              setCourseForm({ title: '', description: '', duration: '', level: 'Beginner', modules: 0, price: '' })
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Courses List */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">All Courses</h2>
                  <Button onClick={loadData} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayCourses.length === 0 ? (
                    <p style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>No courses yet</p>
                  ) : (
                    displayCourses.map((course) => (
                      <Card 
                        key={course.id}
                        style={{
                          backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                          borderColor: isLight ? '#E0D5C7' : '#334155',
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>{course.title}</CardTitle>
                          <CardDescription style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>{course.level}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p style={{ color: isLight ? '#A38970' : '#CBD5E1' }} className="text-sm line-clamp-2">{course.description}</p>
                          <div style={{ color: isLight ? '#A38970' : '#CBD5E1' }} className="text-xs space-y-1">
                            <div className="flex items-center gap-2 font-bold text-primary mb-1">
                              <Users className="w-3 h-3" />
                              <span>{bookings.filter(b => (b.tier_name === course.title || b.tier_name.toLowerCase().includes(course.title.toLowerCase())) && b.service_type === 'Course').length} Registered</span>
                            </div>
                            <p>{course.duration} • {course.modules} modules</p>
                            <p className="font-semibold">{course.price}</p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingCourse(course)
                                setCourseForm(course)
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteCourse(course.id || '')}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* ===== WEBINARS TAB ===== */}
            <TabsContent value="webinars" className="space-y-8 min-h-screen">
              {/* Webinar Form */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <Card
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                    borderColor: isLight ? '#E0D5C7' : '#334155',
                  }}
                >
                  <CardHeader>
                    <CardTitle style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
                      {editingWebinar ? 'Edit Webinar' : 'Create New Webinar'}
                    </CardTitle>
                    <CardDescription style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
                      Fill in the webinar details below
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateWebinar} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="w-title">Title *</Label>
                          <Input
                            id="w-title"
                            placeholder="e.g., Stock Market Basics"
                            value={webinarForm.title}
                            onChange={(e) => setWebinarForm({ ...webinarForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="w-category">Category *</Label>
                          <select
                            id="w-category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={webinarForm.service_category}
                            onChange={(e) => setWebinarForm({ ...webinarForm, service_category: e.target.value })}
                            required
                          >
                            <option value="webinar">Webinar Session</option>
                            <option value="consultation">Consultation</option>
                            <option value="premium">Premium Package</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="w-starts_at">Start Date & Time (for Webinars)</Label>
                          <Input
                            id="w-starts_at"
                            type="datetime-local"
                            value={webinarForm.starts_at}
                            onChange={(e) => setWebinarForm({ ...webinarForm, starts_at: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="w-description">Description</Label>
                        <Textarea
                          id="w-description"
                          placeholder="Webinar description"
                          value={webinarForm.description}
                          onChange={(e) => setWebinarForm({ ...webinarForm, description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="w-duration">Duration (min)</Label>
                          <Input
                            id="w-duration"
                            type="number"
                            placeholder="e.g., 90"
                            value={webinarForm.duration_minutes}
                            onChange={(e) => setWebinarForm({ ...webinarForm, duration_minutes: parseInt(e.target.value) || 60 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="w-platform">Platform</Label>
                          <Input
                            id="w-platform"
                            placeholder="e.g., Zoom"
                            value={webinarForm.platform}
                            onChange={(e) => setWebinarForm({ ...webinarForm, platform: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="w-price">Price</Label>
                          <Input
                            id="w-price"
                            placeholder="e.g., Free"
                            value={webinarForm.price}
                            onChange={(e) => setWebinarForm({ ...webinarForm, price: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="w-seats">Seats</Label>
                          <Input
                            id="w-seats"
                            type="number"
                            placeholder="e.g., 500"
                            value={webinarForm.seats}
                            onChange={(e) => setWebinarForm({ ...webinarForm, seats: parseInt(e.target.value) || 500 })}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit" disabled={submitLoading}>
                          {editingWebinar ? 'Update Webinar' : 'Create Webinar'}
                        </Button>
                        {editingWebinar && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingWebinar(null)
                              setWebinarForm({ title: '', description: '', starts_at: '', duration_minutes: 60, platform: 'Zoom', price: '', seats: 500 })
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Webinars List */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">All Webinars</h2>
                  <Button onClick={loadData} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayWebinars.length === 0 ? (
                    <p style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>No webinars yet</p>
                  ) : (
                    displayWebinars.map((webinar) => {
                      try {
                        const webinarRegs = bookings.filter(b => b.tier_name === webinar.title && b.service_type === 'Webinar').length
                        return (
                          <Card 
                            key={webinar.id}
                            style={{
                              backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                              borderColor: isLight ? '#E0D5C7' : '#334155',
                            }}
                          >
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <CardTitle className="text-lg" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>{webinar.title}</CardTitle>
                                  <CardDescription style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>{webinar.platform}</CardDescription>
                                </div>
                                <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                  {webinarRegs} Registered
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p style={{ color: isLight ? '#A38970' : '#CBD5E1' }} className="text-sm line-clamp-2">{webinar.description}</p>
                              <div style={{ color: isLight ? '#A38970' : '#CBD5E1' }} className="text-xs space-y-1">
                                <p>{safeFormatDate(webinar.starts_at)}</p>
                                <p>{webinar.duration_minutes || 60} minutes</p>
                                <p className="font-semibold">{webinar.price || 'N/A'}</p>
                                <p>{webinar.seats || 500} seats</p>
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingWebinar(webinar)
                                    setWebinarForm(webinar)
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => triggerDelete(webinar.id || '', 'webinar', webinar.title)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      } catch (err) {
                        console.error('Error rendering webinar:', webinar, err)
                        return (
                          <Card 
                            key={webinar.id}
                            style={{
                              backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                              borderColor: isLight ? '#E0D5C7' : '#334155',
                            }}
                          >
                            <CardHeader>
                              <CardTitle className="text-lg" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>{webinar.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p style={{ color: '#EF4444' }} className="text-xs">Error rendering webinar</p>
                            </CardContent>
                          </Card>
                        )
                      }
                    })
                  )}
                </div>
              </motion.div>
            </TabsContent>
            {/* ===== NSE PROGRAMS TAB ===== */}
            <TabsContent value="nse" className="space-y-8 min-h-screen">
              {/* NSE Form */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <Card style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B', borderColor: isLight ? '#E0D5C7' : '#334155' }}>
                  <CardHeader>
                    <CardTitle>{editingNSE ? 'Edit NSE Program' : 'Create NSE Program'}</CardTitle>
                    <CardDescription>Manage investment program tiers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateNSE} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Title *</Label>
                          <Input value={nseForm.title} onChange={e => setNseForm({...nseForm, title: e.target.value})} placeholder="e.g., Basic" required />
                        </div>
                        <div>
                          <Label>Price *</Label>
                          <Input value={nseForm.price} onChange={e => setNseForm({...nseForm, price: e.target.value})} placeholder="e.g., ₹5,000" required />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={nseForm.category} 
                            onChange={e => setNseForm({...nseForm, category: e.target.value})}
                          >
                            <option value="foundational">Foundational</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Badge / Label</Label>
                          <Input value={nseForm.badge_label} onChange={e => setNseForm({...nseForm, badge_label: e.target.value})} placeholder="e.g., Starter Access" />
                        </div>
                        <div>
                          <Label>Duration & Sessions</Label>
                          <div className="flex gap-2">
                            <Input value={nseForm.duration} onChange={e => setNseForm({...nseForm, duration: e.target.value})} placeholder="4 Weeks" />
                            <Input value={nseForm.sessions} onChange={e => setNseForm({...nseForm, sessions: e.target.value})} placeholder="8 Sessions" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={nseForm.description} onChange={e => setNseForm({...nseForm, description: e.target.value})} placeholder="Program details..." rows={2} />
                      </div>
                      <div className="flex gap-4">
                        <Button type="submit" disabled={submitLoading}>{editingNSE ? 'Update' : 'Create'}</Button>
                        {editingNSE && <Button type="button" variant="outline" onClick={() => {setEditingNSE(null); setNseForm({title:'',price:'',badge_label:'',category:'foundational',description:'',duration:'',sessions:''})}}>Cancel</Button>}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nsePrograms.map(program => {
                  const nseRegs = bookings.filter(b => b.service_type === 'NSE' && b.tier_name === program.title).length
                  return (
                  <Card key={program.id} style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B', borderColor: isLight ? '#E0D5C7' : '#334155' }}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{program.title}</CardTitle>
                          <CardDescription>{program.badge_label}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] uppercase font-bold px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full">{program.category}</span>
                          <span className="text-[10px] font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">{nseRegs} Registered</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p className="opacity-70 line-clamp-2">{program.description}</p>
                      <div className="font-bold text-primary">{program.price}</div>
                      <p className="text-xs opacity-50">{program.duration} • {program.sessions}</p>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => {setEditingNSE(program); setNseForm(program)}}><Edit2 className="w-4 h-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => triggerDelete(program.id!, 'nse', program.title)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                  )
                })}

              </div>
            </TabsContent>

            {/* ===== LEADS & BOOKINGS TAB ===== */}
            <TabsContent value="leads" className="space-y-8 min-h-screen">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Inquiries & Program Enrollments</h2>
                <div className="flex gap-2">
                  <div className="flex items-center gap-4 bg-muted/30 px-4 py-1.5 rounded-full border border-border text-xs font-medium">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Foundational: {bookings.filter(b => b.tier_name.toLowerCase().includes('foundational')).length}</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Advanced: {bookings.filter(b => b.tier_name.toLowerCase().includes('advanced')).length}</span>
                  </div>
                  <Button onClick={loadData} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </Button>
                </div>
              </div>

              {/* Webinar Inquiries */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-l-4 border-primary pl-3 py-1">Webinar Inquiries ({inquiries.length})</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {inquiries.map((inq) => (
                    <Card key={inq.id} style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B', borderColor: isLight ? '#E0D5C7' : '#334155' }}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{inq.full_name}</CardTitle>
                            <CardDescription>{inq.service_interested || 'General Inquiry'}</CardDescription>
                          </div>
                          <span className="text-[10px] opacity-60 bg-muted px-2 py-1 rounded-full">{safeFormatDate(inq.created_at)}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 group">
                              <span className="opacity-60"><Eye className="w-4 h-4" /></span>
                              <span className="font-mono">
                                {revealedIds[inq.id] ? inq.email : maskEmail(inq.email)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="opacity-60"><Phone className="w-4 h-4" /></span>
                              <span className="font-mono">
                                {revealedIds[inq.id] ? (inq.phone_number || 'N/A') : maskPhone(inq.phone_number)}
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 py-0 px-2 text-xs" 
                              onClick={() => toggleReveal(inq.id)}
                            >
                              {revealedIds[inq.id] ? <><EyeOff className="w-3 h-3 mr-1" /> Hide</> : <><Eye className="w-3 h-3 mr-1" /> Reveal Info</>}
                            </Button>
                          </div>

                          <div className="p-3 rounded-md bg-muted/30 border border-border/50 text-sm italic">
                            "{inq.message}"
                          </div>

                          {revealedIds[inq.id] && inq.phone_number && (
                            <div className="flex gap-2 pt-1">
                              <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
                                <a href={`https://wa.me/${inq.phone_number.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                                  <MessageSquare className="w-3 h-3 mr-1" /> WhatsApp
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
                                <a href={`mailto:${inq.email}`}>
                                  Email Client
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* NSE Bookings */}
              <div className="space-y-4 pt-8">
                <h3 className="text-xl font-semibold border-l-4 border-[#D1AF62] pl-3 py-1">NSE Program Bookings ({bookings.length})</h3>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/50">
                      <tr>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Program / Tier</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {bookings.length === 0 ? (
                        <tr><td colSpan={6} className="px-4 py-8 text-center opacity-50">No bookings yet</td></tr>
                      ) : (
                        bookings.map((book) => (
                          <tr key={book.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium">{book.full_name}</td>
                            <td className="px-4 py-3">
                              <span className="font-semibold block">{book.tier_name}</span>
                              <span className="text-[10px] opacity-60 uppercase">{book.service_type}</span>
                            </td>
                            <td className="px-4 py-3 font-mono text-[12px]">
                              {revealedIds[book.id] ? (
                                <div>
                                  <p>{book.email}</p>
                                  <p>{book.phone_number}</p>
                                </div>
                              ) : (
                                <div>
                                  <p>{maskEmail(book.email)}</p>
                                  <p>{maskPhone(book.phone_number)}</p>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 font-semibold">₹{book.price}</td>
                            <td className="px-4 py-3 text-xs opacity-70">{safeFormatDate(book.created_at)}</td>
                            <td className="px-4 py-3 text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-3" 
                                onClick={() => toggleReveal(book.id)}
                              >
                                {revealedIds[book.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CUSTOM DELETE CONFIRMATION MODAL */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-md w-full rounded-2xl p-8 shadow-2xl border"
                style={{ 
                  backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                  borderColor: isLight ? '#E0D5C7' : '#334155'
                }}
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>Are you sure?</h3>
                  <p style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
                    You are about to delete <span className="font-bold text-primary">"{deleteConfirm.title}"</span>. 
                    This action cannot be undone and will remove all associated data.
                  </p>
                  <div className="flex gap-3 pt-6">
                    <Button 
                      className="flex-1 py-6 rounded-xl font-bold" 
                      variant="outline" 
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 py-6 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white" 
                      onClick={confirmDelete}
                    >
                      Delete Forever
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </>
  )
}
