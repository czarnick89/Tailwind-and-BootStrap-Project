import { useState, useEffect } from "react";
import WorkoutAccordion from "./WorkoutAccordion";
import NewWorkoutModal from "./NewWorkoutModal";
import NewExerciseModal from "./NewExerciseModal";

export default function WorkoutList({ data }) {
  const [workouts, setWorkouts] = useState(data.results || []);
  const [nextWorkoutId, setNextWorkoutId] = useState(1000);
  const [nextExerciseId, setNextExerciseId] = useState(5000); // For new exercises

  useEffect(() => {
    setWorkouts(data.results || []);
  }, [data]);

  // Workout modal state
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  // Exercise modal state & tracking current workout to add to
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [currentWorkoutIdForNewExercise, setCurrentWorkoutIdForNewExercise] =
    useState(null);

  // Add a new workout (from modal)
  const handleSaveWorkout = async (title) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const localDateString = `${year}-${month}-${day}`;

    const newWorkout = {
      name: title,
      date: localDateString,
      notes: "",
      exercises: [],
    };

    try {
      // Replace with your backend URL and add auth header if needed
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://127.0.0.1:8000/api/workouts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newWorkout),
      });

      if (!response.ok) {
        throw new Error("Failed to save workout");
      }

      const savedWorkout = await response.json();

      // Add the workout returned from the server (with real id)
      setWorkouts((prev) => [...prev, savedWorkout]);
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout: " + error.message);
    }
  };

  // Delete a workout by id
  const handleDeleteWorkout = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://127.0.0.1:8000/api/workouts/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete workout");
      }

      // Remove from local state only if backend delete was successful
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== id)
      );
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("Failed to delete workout: " + error.message);
    }
  };

  // Open exercise modal and store workout ID
  const openAddExerciseModal = (workoutId) => {
    setCurrentWorkoutIdForNewExercise(workoutId);
    setShowExerciseModal(true);
  };

  // Add a new exercise to a workout by workout id
  const handleAddExercise = async (exerciseName) => {
    if (!currentWorkoutIdForNewExercise) return;

    try {
      const accessToken = localStorage.getItem("accessToken");

      // POST to backend
      const response = await fetch("http://127.0.0.1:8000/api/exercises/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: exerciseName,
          workout: currentWorkoutIdForNewExercise, // assuming backend expects a workout FK field
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add exercise");
      }

      const newExercise = await response.json();

      // Update frontend state with backend's new exercise data
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) => {
          if (workout.id === currentWorkoutIdForNewExercise) {
            return {
              ...workout,
              exercises: [...workout.exercises, newExercise],
            };
          }
          return workout;
        })
      );

      setShowExerciseModal(false);
      setCurrentWorkoutIdForNewExercise(null);
    } catch (error) {
      console.error("Error adding exercise:", error);
      alert("Failed to add exercise: " + error.message);
    }
  };

  // Delete an exercise from a specific workout
  const handleDeleteExercise = async (workoutId, exerciseId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://127.0.0.1:8000/api/exercises/${exerciseId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete exercise");
      }

      // Remove exercise from frontend state only if backend delete was successful
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: workout.exercises.filter((ex) => ex.id !== exerciseId),
            };
          }
          return workout;
        })
      );
    } catch (error) {
      console.error("Error deleting exercise:", error);
      alert("Failed to delete exercise: " + error.message);
    }
  };

  return (
    <div className="container">
      {/* Add Workout Button */}
      <div className="text-end mb-3">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setShowWorkoutModal(true)}
        >
          + Add Workout
        </button>
      </div>

      {/* Workout Modal */}
      <NewWorkoutModal
        show={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        onSave={async (title) => {
          await handleSaveWorkout(title);
          setShowWorkoutModal(false);
        }}
      />

      {/* Exercise Modal */}
      <NewExerciseModal
        show={showExerciseModal}
        onClose={() => {
          setShowExerciseModal(false);
          setCurrentWorkoutIdForNewExercise(null);
        }}
        onSave={handleAddExercise}
      />

      {/* Workout Accordions */}
      <div className="accordion" id="workoutAccordion">
        {workouts.map((workout, index) => (
          <WorkoutAccordion
            key={workout.id}
            workout={workout}
            index={index}
            onDelete={() => handleDeleteWorkout(workout.id)}
            onAddExercise={() => openAddExerciseModal(workout.id)}
            onDeleteExercise={handleDeleteExercise}
          />
        ))}
      </div>
    </div>
  );
}
