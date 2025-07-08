import { useState, useEffect } from 'react';

export default function NewExerciseModal({ show, onClose, onSave }) {
  const [exerciseName, setExerciseName] = useState('');

  // Clear input when modal opens
  useEffect(() => {
    if (show) setExerciseName('');
  }, [show]);

  if (!show) return null;

  const handleSave = () => {
    if (exerciseName.trim() === '') {
      alert('Please enter an exercise name.');
      return;
    }
    onSave(exerciseName.trim());
  };

  return (
    <div className="modal show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Exercise</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              placeholder="Exercise name"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Add Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
