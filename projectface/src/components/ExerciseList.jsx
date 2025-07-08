import React from "react";
import SetList from "./SetList";

export default function ExerciseList({
  exercises,
  workoutId,
  onDeleteExercise,
  parentIndex,
}) {
  // Add a new set with the full payload (including reps, weight, set_number, exercise)
  const addSetBackend = async (payload) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch("http://127.0.0.1:8000/api/sets/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to add set");
    }

    return response.json();
  };

  // Update existing set by ID
  const updateSetBackend = async (set) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`http://127.0.0.1:8000/api/sets/${set.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(set),
    });

    if (!response.ok) {
      throw new Error("Failed to update set");
    }

    return response.json();
  };

  // Delete set by ID
  const deleteSetBackend = async (setId) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`http://127.0.0.1:8000/api/sets/${setId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete set");
    }
  };

  return (
    <div className="accordion mt-3" id={`exerciseAccordion-${parentIndex}`}>
      {exercises.map((exercise, i) => {
        const headingId = `exercise-heading-${parentIndex}-${i}`;
        const collapseId = `exercise-collapse-${parentIndex}-${i}`;

        return (
          <div className="accordion-item" key={exercise.id}>
            <h2 className="accordion-header" id={headingId}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${collapseId}`}
                aria-expanded="false"
                aria-controls={collapseId}
              >
                {exercise.name}
              </button>
            </h2>
            <div
              id={collapseId}
              className="accordion-collapse collapse"
              aria-labelledby={headingId}
              data-bs-parent={`#exerciseAccordion-${parentIndex}`}
            >
              <div className="accordion-body">
                <SetList
                  sets={exercise.sets}
                  exerciseId={exercise.id}
                  onAddSetBackend={addSetBackend}
                  onUpdateSetBackend={updateSetBackend}
                  onDeleteSetBackend={deleteSetBackend}
                  onDeleteExercise={() =>
                    onDeleteExercise(workoutId, exercise.id)
                  }
                />
                <div className="d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${exercise.name}"?`
                        )
                      ) {
                        onDeleteExercise(workoutId, exercise.id);
                      }
                    }}
                  >
                    Delete Exercise
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
