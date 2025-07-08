import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function NewWorkoutModal({ show, onClose, onSave }) {
  const [title, setTitle] = useState('');

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
      setTitle('');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>New Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="workoutTitle">
            <Form.Label>Workout Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter workout title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!title.trim()}>
          Add Workout
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
