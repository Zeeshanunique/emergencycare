import { Hospital } from '@/types';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Phone, MapPin, Clock, Star, Ambulance, Bed } from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  onEdit: (hospital: Hospital) => void;
  onDelete: (id: string) => void;
}

export default function HospitalCard({ hospital, onEdit, onDelete }: HospitalCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{hospital.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{hospital.address}</span>
            <span>({String(hospital.distance)}km)</span>
          </div>
        </div>
        <Badge variant={hospital.openNow ? "default" : "destructive"}>
          {hospital.openNow ? 'Open' : 'Closed'}
        </Badge>
      </div>

      <div className="grid gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span>{hospital.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Bed className="h-4 w-4 text-gray-500" />
          <span>Available Beds {String(hospital.availableBeds || 0)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Specialties</h4>
        <div className="flex flex-wrap gap-2">
          {hospital.specialties?.map((specialty, index) => (
            <Badge 
              key={`${hospital._id}-${specialty}-${index}`}
              variant="outline"
            >
              {specialty}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={`star-${i}`}
              className={`h-4 w-4 ${
                i < (hospital.rating || 0) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(hospital)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(hospital._id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}