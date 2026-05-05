'use client';

import React, { useState } from 'react';
import Dialog from './Dialog';
import { ClipboardList, CheckCircle2, AlertCircle } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  subject: string;
  project: string;
  assignedTo: string;
  status: string;
  priority: string;
  description: string;
}

interface FormErrors {
  subject?: string;
  project?: string;
  assignedTo?: string;
  status?: string;
  priority?: string;
}

const INITIAL: FormData = {
  subject: '',
  project: '',
  assignedTo: '',
  status: '',
  priority: '',
  description: '',
};

const inputClass = (error?: string) =>
  `w-full px-3 py-2 text-sm border rounded-md bg-gray-50 text-text-main focus:bg-white focus:outline-none focus:ring-[1.5px] transition-all ${
    error
      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
      : 'border-border-subtle focus:ring-primary focus:border-primary'
  }`;

export default function AddTaskModal({ isOpen, onClose, onSuccess }: AddTaskModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.subject.trim())    newErrors.subject    = 'Task subject is required.';
    if (!form.project.trim())    newErrors.project    = 'Project is required.';
    if (!form.assignedTo.trim()) newErrors.assignedTo = 'Please assign this task to someone.';
    if (!form.status)            newErrors.status     = 'Please select a status.';
    if (!form.priority)          newErrors.priority   = 'Please select a priority.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800)); // Simulate API call
    setIsSubmitting(false);
    setForm(INITIAL);
    setErrors({});
    onSuccess();
  };

  const handleClose = () => {
    setForm(INITIAL);
    setErrors({});
    onClose();
  };

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {msg}
      </p>
    ) : null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Task"
      icon={<ClipboardList className="w-5 h-5" />}
      size="lg"
      buttons={[
        { label: 'Cancel', onClick: handleClose, variant: 'ghost' },
        {
          label: isSubmitting ? 'Saving...' : 'Create Task',
          onClick: handleSubmit,
          variant: 'primary',
        },
      ]}
    >
      <div className="space-y-5">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Finalise plant venue"
            value={form.subject}
            onChange={set('subject')}
            className={inputClass(errors.subject)}
          />
          <FieldError msg={errors.subject} />
        </div>

        {/* Project + Assigned To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Project <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. PROJ-0002"
              value={form.project}
              onChange={set('project')}
              className={inputClass(errors.project)}
            />
            <FieldError msg={errors.project} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Assigned To <span className="text-red-500">*</span>
            </label>
            <select
              value={form.assignedTo}
              onChange={set('assignedTo')}
              className={inputClass(errors.assignedTo)}
            >
              <option value="">Select assignee...</option>
              <option>Sayed Abbas</option>
              <option>Ahmed Al-Rashidi</option>
              <option>Fatima Khalid</option>
              <option>Unassigned</option>
            </select>
            <FieldError msg={errors.assignedTo} />
          </div>
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={form.status}
              onChange={set('status')}
              className={inputClass(errors.status)}
            >
              <option value="">Select status...</option>
              <option value="Completed">Completed</option>
              <option value="Working">Working</option>
              <option value="Overdue">Overdue</option>
            </select>
            <FieldError msg={errors.status} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              value={form.priority}
              onChange={set('priority')}
              className={inputClass(errors.priority)}
            >
              <option value="">Select priority...</option>
              <option value="High">🔴 High</option>
              <option value="Low">⚫ Low</option>
            </select>
            <FieldError msg={errors.priority} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Description <span className="text-text-muted text-xs font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Add more details about this task..."
            value={form.description}
            onChange={set('description')}
            className={`${inputClass()} resize-none`}
          />
        </div>
      </div>
    </Dialog>
  );
}
