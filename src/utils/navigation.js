import {
  LayoutDashboard, Users, Wrench, ClipboardList, Briefcase,
  HardHat, Package, FileText, BarChart3, Settings
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'Workspace' },
  { label: 'Customers', path: '/customers', icon: Users, section: 'Workspace' },
  { label: 'Equipment', path: '/equipment', icon: Wrench, section: 'Operations' },
  { label: 'Service Requests', path: '/service-requests', icon: ClipboardList, section: 'Operations' },
  { label: 'Jobs', path: '/jobs', icon: Briefcase, section: 'Operations' },
  { label: 'Technicians', path: '/technicians', icon: HardHat, section: 'Operations' },
  { label: 'Inventory', path: '/inventory', icon: Package, section: 'Operations' },
  { label: 'Invoices', path: '/invoices', icon: FileText, section: 'Manage' },
  { label: 'Reports', path: '/reports', icon: BarChart3, section: 'Manage' },
  { label: 'Settings', path: '/settings', icon: Settings, section: 'Manage' },
];
