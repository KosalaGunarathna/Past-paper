import React from 'react';
import { 
  Calculator, 
  BookA, 
  Languages, 
  BookOpen, 
  FlaskConical, 
  Landmark, 
  Globe, 
  Flower2, 
  Briefcase, 
  Monitor, 
  Palette, 
  Sprout, 
  Atom, 
  Leaf, 
  Receipt, 
  TrendingUp, 
  Wrench, 
  Dna, 
  Cpu, 
  Brain,
  FileText,
  GraduationCap,
  Award,
  CheckCircle2,
  Lightbulb,
  Calendar,
  Layers
} from 'lucide-react';

const iconMap = {
  Calculator,
  BookA,
  Languages,
  BookOpen,
  FlaskConical,
  Landmark,
  Globe,
  Flower2,
  Briefcase,
  Monitor,
  Palette,
  Sprout,
  Atom,
  Leaf,
  Receipt,
  TrendingUp,
  Wrench,
  Dna,
  Cpu,
  Brain,
  FileText,
  GraduationCap,
  Award,
  CheckCircle2,
  Lightbulb,
  Calendar,
  Layers
};

export default function SubjectIcon({ name, size = 24, className = "" }) {
  const IconComponent = iconMap[name] || BookOpen;
  return <IconComponent size={size} className={className} />;
}
