'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Phone, Clock, Star, AlertCircle } from "lucide-react";
import { Hospital } from '@/types';
import axios from 'axios';

const SPECIALTIES = ['all', 'cardiology', 'emergency', 'neurology', 'orthopedics', 'pediatrics', 'surgery'] as const;

export default function FindHospital() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState<string>('all');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/hospitals');
      setHospitals(response.data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHospitals = hospitals
    .filter(h => h.openNow)
    .filter(h => specialty === 'all' || h.specialties.includes(specialty))
    .filter(h => 
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by hospital name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-2/3"
        />
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {SPECIALTIES.slice(1).map(s => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : filteredHospitals.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-lg">No hospitals found</p>
          </div>
        ) : (
          filteredHospitals.map(hospital => (
            <Card key={hospital._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{hospital.name}</h3>
                  {hospital.emergency && (
                    <Badge variant="destructive">Emergency</Badge>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{hospital.address} • {hospital.distance}km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{hospital.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Wait time: {hospital.waitTime}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {hospital.specialties.map((specialty, index) => (
                      <Badge 
                        key={`${hospital._id}-${specialty}-${index}`}
                        variant={specialty.toLowerCase() === 'emergency' ? "destructive" : "outline"}
                        className="text-xs capitalize"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < hospital.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <Badge variant={hospital.openNow ? "default" : "secondary"}>
                    {hospital.openNow ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}