
import React from 'react';
import { 
    Music, Speaker, Clapperboard, Sparkles, UserCheck, Construction, 
    Camera, Video, Tent, CheckCircle, Package, Truck, Users, DollarSign 
} from 'lucide-react';

export const iconNames = [
    'Music', 'Speaker', 'Clapperboard', 'Sparkles', 'UserCheck', 'Construction',
    'Camera', 'Video', 'Tent', 'CheckCircle', 'Package', 'Truck', 'Users', 'DollarSign'
];

const IconMapper = ({ iconName, size = 32 }: { iconName: string; size?: number }) => {
  switch (iconName) {
    case 'Music':
      return <Music size={size} />;
    case 'Speaker':
      return <Speaker size={size} />;
    case 'Clapperboard':
      return <Clapperboard size={size} />;
    case 'Sparkles':
      return <Sparkles size={size} />;
    case 'UserCheck':
      return <UserCheck size={size} />;
    case 'Construction':
      return <Construction size={size} />;
    case 'Camera':
      return <Camera size={size} />;
    case 'Video':
      return <Video size={size} />;
    case 'Tent':
        return <Tent size={size} />;
    case 'CheckCircle':
        return <CheckCircle size={size} />;
    case 'Package':
        return <Package size={size} />;
    case 'Truck':
        return <Truck size={size} />;
    case 'Users':
        return <Users size={size} />;
    case 'DollarSign':
        return <DollarSign size={size} />;
    default:
      return <Sparkles size={size} />; // Default icon
  }
};

export default IconMapper;
