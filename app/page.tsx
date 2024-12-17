import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  Building2, 
  Navigation, 
  Bell,
  CheckCircle,
  Phone,
  HeartPulse,
  Clock,
  Users,
  Ambulance,
  LayoutDashboard,
  Menu
} from "lucide-react"
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl font-bold text-gray-900"
            >
              <HeartPulse className="h-6 w-6 text-red-600" />
              <span>EmergencyCare</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/findhospital"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Find Hospital
              </Link>
              
              <Link href="/admin">
                <Button 
                  variant="default" 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/findhospital">Find Hospital</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">Contact</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin">Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Find Emergency Care <span className="text-red-600">Instantly</span>
            </h1>
            
            <p className="text-lg text-gray-600">
              Locate nearby hospitals with real-time availability
            </p>

            <Link 
              href="/findhospital"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Find Hospital
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 text-center">
              <Building2 className="h-8 w-8 mx-auto mb-4 text-gray-700" />
              <h3 className="text-lg font-semibold mb-2">Nearby Hospitals</h3>
              <p className="text-gray-600">Find hospitals closest to you</p>
            </div>

            <div className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-4 text-gray-700" />
              <h3 className="text-lg font-semibold mb-2">Wait Times</h3>
              <p className="text-gray-600">Check current wait times</p>
            </div>

            <div className="p-6 text-center">
              <Ambulance className="h-8 w-8 mx-auto mb-4 text-gray-700" />
              <h3 className="text-lg font-semibold mb-2">Emergency Services</h3>
              <p className="text-gray-600">24/7 emergency care</p>
            </div>
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
