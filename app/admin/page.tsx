'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Building2, MoreVertical, Edit, Trash2, Activity, Users, AlertCircle, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Hospital } from '@/types';
import axios from 'axios';

interface FormData {
  name: string;
  address: string;
  phone: string;
  beds: string;
  availableBeds: string;
  emergency: boolean;
  openNow: boolean;
  rating: string;
  specialties: string[];
  waitTime: string;
  distance: string;
}

const AVAILABLE_SPECIALTIES = [
  'Cardiology',
  'Emergency',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Surgery'
];

const INITIAL_FORM_DATA: FormData = {
  name: '',
  address: '',
  phone: '',
  beds: '0',
  availableBeds: '0',
  emergency: false,
  openNow: true,
  rating: '0',
  specialties: [],
  waitTime: '0',
  distance: '0'
};

export default function AdminPage() {
  // State management
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const { toast } = useToast();

  const fetchHospitals = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/hospitals');
      setHospitals(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch hospitals"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitals();
    // Refresh every 30 seconds
    const interval = setInterval(fetchHospitals, 30000);
    return () => clearInterval(interval);
  }, [fetchHospitals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.address || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Transform form data to match API expectations
      const submitData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        beds: parseInt(formData.beds) || 0,
        availableBeds: parseInt(formData.availableBeds) || 0,
        emergency: Boolean(formData.emergency),
        openNow: Boolean(formData.openNow),
        rating: parseFloat(formData.rating) || 0,
        specialties: Array.isArray(formData.specialties) ? formData.specialties : [],
        waitTime: formData.waitTime || '0',
        distance: parseFloat(formData.distance) || 0
      };

      // Validate business logic
      if (submitData.availableBeds > submitData.beds) {
        throw new Error('Available beds cannot exceed total beds');
      }

      const response = editingHospital 
        ? await axios.put(`/api/hospitals/${editingHospital._id}`, submitData)
        : await axios.post('/api/hospitals', submitData);

      if (response.data) {
        await fetchHospitals();
        handleReset();
        toast({
          title: "Success",
          description: `Hospital ${editingHospital ? 'updated' : 'added'} successfully`
        });
      }
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to save hospital"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormData({
      name: hospital.name,
      address: hospital.address,
      phone: hospital.phone,
      beds: hospital.beds.toString(),
      availableBeds: hospital.availableBeds.toString(), // Convert to string
      emergency: hospital.emergency,
      openNow: hospital.openNow,
      rating: hospital.rating.toString(),
      specialties: hospital.specialties,
      waitTime: hospital.waitTime.toString(),
      distance: hospital.distance.toString()
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/hospitals/${id}`);
      await fetchHospitals(); // Refresh list after delete
      toast({
        title: "Success",
        description: "Hospital deleted successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete hospital",
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setUpdatingStatus(id);
      await axios.patch(`/api/hospitals/${id}/status`, {
        openNow: !currentStatus
      });
      await fetchHospitals(); // Refresh list after status update
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleReset = () => {
    setIsOpen(false);
    setEditingHospital(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleSpecialtiesChange = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hospitals</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold">{hospitals.length}</h3>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Beds</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold">
                    {hospitals.reduce((acc, curr) => acc + curr.availableBeds, 0)}
                  </h3>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Units</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold">
                    {hospitals.filter(h => h.emergency).length
                    }
                  </h3>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold">
                    {hospitals.filter(h => h.openNow).length}
                  </h3>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hospitals Management</CardTitle>
          <Button onClick={() => setIsOpen(true)}>Add Hospital</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Beds</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="flex justify-center py-4">
                        <Skeleton className="h-8 w-full max-w-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : hospitals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="text-center py-4 text-muted-foreground">
                        No hospitals found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  hospitals?.map((hospital) => (
                    <TableRow key={hospital._id}>
                      <TableCell>
                        <div>
                          {hospital.name}
                          <span className="md:hidden text-sm text-muted-foreground block">
                            {hospital.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {hospital.address}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {updatingStatus === hospital._id ? (
                            <Skeleton className="h-4 w-[100px]" />
                          ) : (
                            <>
                              <Switch
                                checked={Boolean(hospital.openNow)}
                                onCheckedChange={() => toggleStatus(hospital._id, Boolean(hospital.openNow))}
                                disabled={updatingStatus === hospital._id}
                              />
                              <Badge variant={hospital.openNow ? "default" : "destructive"}>
                                {hospital.openNow ? 'Active' : 'Inactive'}
                              </Badge>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {String(hospital.beds || 0)}
                      </TableCell>
                      <TableCell>
                        {String(hospital.availableBeds || 0)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {hospital.specialties?.map((specialty, index) => (
                            <Badge 
                              key={`${hospital._id}-${specialty}-${index}`} 
                              variant="outline"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(hospital)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(hospital._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6">
            Add Hospital
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingHospital ? 'Edit Hospital' : 'Add Hospital'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Hospital Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="beds">Beds</Label>
                <Input
                  id="beds"
                  type="number"
                  value={formData.beds}
                  onChange={(e) => setFormData({
                    ...formData,
                    beds: e.target.value || '0'
                  })}
                  className="col-span-3"
                  min={0}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="availableBeds">Available Beds</Label>
                <Input
                  id="availableBeds"
                  type="number"
                  value={formData.availableBeds}
                  onChange={(e) => setFormData({
                    ...formData,
                    availableBeds: e.target.value || '0'
                  })}
                  className="col-span-3"
                  min={0}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Specialties</Label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SPECIALTIES.map(specialty => (
                    <Badge
                      key={specialty}
                      variant={formData.specialties.includes(specialty) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleSpecialtiesChange(specialty)}
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingHospital ? 'Update Hospital' : 'Add Hospital'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}