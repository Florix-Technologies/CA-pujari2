"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, CreditCard, CheckCircle2, Loader2, Send, Phone, User } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  price?: string
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, damping: 25, stiffness: 300 }
  },
  exit: { opacity: 0, scale: 0.95, y: 20 }
}

export function BookingModal({ 
  isOpen, 
  onClose, 
  serviceName, 
  price,
  apiEndpoint = '/api/webinars/book',
  section,
  isPremium
}: ModalProps & { apiEndpoint?: string; section?: string; isPremium?: boolean }) {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { user } = useAuth()
  
  const [date, setDate] = useState("")
  const [time, setTime] = useState("10:00")
  const [phone, setPhone] = useState("")
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || user?.email?.split('@')[0] || "")
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [error, setError] = useState<string | null>(null)

  const handleNext = () => setStep(2)

  const handlePayment = async () => {
    if (!user) {
      setError("Please log in to book a session")
      return
    }
    setError(null)
    setIsProcessing(true)
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: fullName,
          email: user.email,
          phone: phone,
          webinar_title: serviceName,
          webinar_date: date,
          webinar_time: time,
          amount: price?.replace(/[^0-9.]/g, '') || "0",
          duration: "4 Sessions",
          section: section
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to process booking')

      setIsProcessing(false)
      setStep(3)
    } catch (err: any) {
      console.error('Booking error:', err)
      setError(err.message || "Something went wrong. Please try again.")
      setIsProcessing(false)
    }
  }

  const resetAndClose = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
      setDate("")
      setTime("10:00")
    }, 500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            variants={overlayVariants} 
            initial="hidden" 
            animate="visible" 
            exit="hidden" 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={resetAndClose}
          />
          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[var(--fin-border-divider)]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--fin-border-divider)] bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Book Session</h3>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[250px]">{serviceName}</p>
              </div>
              <button onClick={resetAndClose} className="p-2 rounded-full hover:bg-black/5 text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Select Date</label>
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors bg-white font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Select Time</label>
                      <select 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors bg-white font-medium text-slate-900"
                      >
                        <option value="10:00">10:00 AM IST</option>
                        <option value="14:00">02:00 PM IST</option>
                        <option value="18:00">06:00 PM IST</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your official name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors bg-white font-medium text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors bg-white font-medium text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 italic">
                      {error}
                    </div>
                  )}

                  <div className="pt-2">
                    <button 
                      onClick={handleNext}
                      disabled={!date || !phone || !fullName}
                      className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Calendar size={18} />
                      Next: Payment ({price})
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                    <p className="text-sm font-medium text-slate-500">Total Amount due</p>
                    <p className="text-3xl font-bold text-slate-900">{price}</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-900">Select Payment Method</label>
                    <div 
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center gap-3 ${paymentMethod === 'upi' ? 'border-[var(--fin-accent-gold)] bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[var(--fin-accent-gold)]' : 'border-gray-300'}`}>
                        {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-[var(--fin-accent-gold)] rounded-full" />}
                      </div>
                      <span className="font-medium text-slate-900">UPI (GPay, PhonePe, Paytm)</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center gap-3 ${paymentMethod === 'card' ? 'border-[var(--fin-accent-gold)] bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[var(--fin-accent-gold)]' : 'border-gray-300'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-[var(--fin-accent-gold)] rounded-full" />}
                      </div>
                      <span className="font-medium text-slate-900">Credit / Debit Card</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-5 py-3.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 py-3.5 bg-[var(--fin-accent-gold)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#b5954e] transition-colors disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <><Loader2 size={18} className="animate-spin" /> Processing...</>
                      ) : (
                        <><CreditCard size={18} /> Pay Securely</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="py-8 text-center space-y-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" as const, bounce: 0.5 }}
                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h3>
                  <p className="text-slate-600 text-sm max-w-[280px] mx-auto leading-relaxed">
                    Your session for <span className="font-bold text-slate-900">{serviceName}</span> is scheduled. We have sent the joining details to your email.
                  </p>

                  {(section === 'advanced' || isPremium) && (
                    <div className="p-4 mx-auto max-w-[300px] rounded-xl bg-slate-50 border border-slate-200 shadow-inner mt-4">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Direct Priority Contact</p>
                      <p className="text-[var(--fin-accent-gold)] font-bold text-sm">Pujarishobhac@gmail.com</p>
                    </div>
                  )}
                  <div className="pt-6">
                    <button 
                      onClick={resetAndClose}
                      className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function InquiryModal({ isOpen, onClose, serviceName, isPremium }: Omit<ModalProps, 'price'> & { isPremium?: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    message: ""
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/webinars/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceName
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to submit inquiry')

      setSubmitted(true)
    } catch (err: any) {
      console.error('Inquiry error:', err)
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetAndClose = () => {
    onClose()
    setTimeout(() => {
      setSubmitted(false)
      setError(null)
      setFormData({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        message: ""
      })
    }, 500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            variants={overlayVariants} 
            initial="hidden" 
            animate="visible" 
            exit="hidden" 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={resetAndClose}
          />
          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Inquiry Form</h3>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[300px]">{serviceName}</p>
              </div>
              <button onClick={resetAndClose} className="p-2 rounded-full hover:bg-black/5 text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Company (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Your Company"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Email</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Phone</label>
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1.5">Requirements / Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Briefly describe what you are looking for..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors resize-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 italic">
                      {error}
                    </div>
                  )}

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-wait"
                    >
                      {isSubmitting ? (
                        <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                      ) : (
                        <><Send size={18} /> Submit Inquiry</>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-10 text-center space-y-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" as const, bounce: 0.5 }}
                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900">Inquiry Received!</h3>
                  <p className="text-slate-600 text-sm max-w-[300px] mx-auto leading-relaxed">
                    Thank you for reaching out regarding <span className="font-bold text-slate-900">{serviceName}</span>. 
                    Our team will review your requirements and get back to you shortly.
                  </p>

                  {isPremium && (
                    <div className="p-4 mx-auto max-w-[300px] rounded-xl bg-slate-50 border border-slate-200 shadow-inner">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Direct Contact</p>
                      <p className="text-[var(--fin-accent-gold)] font-bold text-sm">Pujarishobhac@gmail.com</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <button 
                      onClick={resetAndClose}
                      className="w-full py-3.5 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      Close Form
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
