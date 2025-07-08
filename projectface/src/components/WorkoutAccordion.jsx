import ExerciseList from './ExerciseList';

export default function WorkoutAccordion({ workout, index, onDelete, onAddExercise, onDeleteExercise }) {
  const headingId = `heading-${index}`;
  const collapseId = `collapse-${index}`;

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={headingId}>
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${collapseId}`}
          aria-expanded="false"
          aria-controls={collapseId}
        >
          {workout.name} – {workout.date}
        </button>
      </h2>

      <div
        id={collapseId}
        className="accordion-collapse collapse"
        aria-labelledby={headingId}
      >
        <div className="accordion-body">
          <ExerciseList
            exercises={workout.exercises}
            parentIndex={index}
            workoutId={workout.id}
            onDeleteExercise={onDeleteExercise}
          />

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onAddExercise(workout.id)}
            >
              + Add Exercise
            </button>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${workout.name}"?`)) {
                  onDelete(workout.id);
                }
              }}
            >
              Delete Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
