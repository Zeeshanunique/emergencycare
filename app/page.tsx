import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  Building2, // Changed from Hospital
  Navigation, 
  Bell,
  CheckCircle,
  Phone,
  HeartPulse,
  Clock,
  Users,
  Ambulance 
} from "lucide-react"
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b bg-white/75">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <HeartPulse className="h-6 w-6 text-red-600" />
            <span className="font-bold text-xl">EmergencyCare</span>
          </Link>
          <Button variant="destructive" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Emergency: 911
          </Button>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-red-50">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <div className="inline-block">
              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                24/7 Emergency Care
              </span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-blue-900">
              Immediate Medical <span className="text-red-600">Care</span> When Every Second Counts
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Find the nearest emergency care instantly with real-time hospital availability and wait times.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/findhospital">
                <Button size="lg" variant="destructive" className="group">
                  Find Nearest Hospital
                  <Navigation className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/admin">
              <Button size="lg" variant="outline" className="group">
                Admin Dashboard
                <Clock className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 mt-12 md:mt-0 grid grid-cols-2 gap-4">
            {[
              { icon: <Users className="h-8 w-8" />, stat: "2M+", label: "Patients Helped" },
              { icon: <Building2 className="h-8 w-8" />, stat: "500+", label: "Partner Hospitals" },
              { icon: <Ambulance className="h-8 w-8" />, stat: "15 min", label: "Avg Response Time" },
              { icon: <HeartPulse className="h-8 w-8" />, stat: "98%", label: "Success Rate" }
            ].map((item, index) => (
              <Card key={index} className="bg-white/50 backdrop-blur-sm hover:bg-white/75 transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="text-red-600 mb-2 flex justify-center">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-blue-900">{item.stat}</h3>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Building2 className="h-8 w-8 text-blue-600" />,
              title: "24/7 Accessibility",
              description: "Access emergency care services anytime, anywhere"
            },
            {
              icon: <Navigation className="h-8 w-8 text-blue-600" />,
              title: "Geolocation Search",
              description: "Find the nearest hospital in seconds"
            },
            {
              icon: <Bell className="h-8 w-8 text-blue-600" />,
              title: "Instant Notifications",
              description: "Real-time updates on appointments"
            }
          ].map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Advantages Section */}
        <section className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight mb-12 text-center">
              Why Choose Us
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Enhanced Accessibility",
                "Efficient Geolocation",
                "Streamlined Communication",
                "Centralized Management",
                "User-Friendly Interface",
              ].map((advantage, index) => (
                <Card key={index} className="bg-blue-800 border-blue-700">
                  <CardContent className="flex items-center p-4">
                    <CheckCircle className="mr-4 h-6 w-6" />
                    <p className="font-medium text-white">{advantage}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <h3 className="scroll-m-20 text-2xl font-bold tracking-tight mb-4">
              Emergency? Call 911
            </h3>
            <p className="text-gray-400">Available 24/7 for medical emergencies</p>
          </div>
        </footer>
      </div>
    </>
  );
}
