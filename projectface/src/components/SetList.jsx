import React, { useState, useEffect } from "react";

export default function SetList({
  sets = [],
  exerciseId,
  onAddSetBackend,
  onDeleteSetBackend,
  onUpdateSetBackend,
  // onDeleteExercise removed since not used here anymore
}) {
  const [editableSets, setEditableSets] = useState(
    sets.map((set) => ({
      ...set,
      reps: set.reps === 0 ? "" : set.reps,
      weight: set.weight === 0 ? "" : set.weight,
    }))
  );

  const [tempIdCounter, setTempIdCounter] = useState(-1);

  useEffect(() => {
    setEditableSets(
      sets.map((set) => ({
        ...set,
        reps: set.reps === 0 ? "" : set.reps,
        weight: set.weight === 0 ? "" : set.weight,
      }))
    );
  }, [sets]);

  const handleChange = (id, field, value) => {
    const updated = editableSets.map((set) =>
      set.id === id ? { ...set, [field]: value } : set
    );
    setEditableSets(updated);
  };

  const handleBlur = async (id) => {
    const setToUpdate = editableSets.find((set) => set.id === id);
    if (!setToUpdate) return;

    const repsValid =
      setToUpdate.reps !== null &&
      setToUpdate.reps !== "" &&
      !isNaN(setToUpdate.reps) &&
      Number(setToUpdate.reps) >= 0;
    const weightValid =
      setToUpdate.weight !== null &&
      setToUpdate.weight !== "" &&
      !isNaN(setToUpdate.weight) &&
      Number(setToUpdate.weight) >= 0;

    if (repsValid && weightValid) {
      const setNumber = editableSets.findIndex((set) => set.id === id) + 1;
      const payload = {
        exercise: exerciseId,
        set_number: setNumber,
        reps: Number(setToUpdate.reps),
        weight: Number(setToUpdate.weight),
      };

      if (id < 0) {
        // New set - POST
        try {
          const createdSet = await onAddSetBackend(payload);
          setEditableSets((prev) =>
            prev.map((s) => (s.id === id ? createdSet : s))
          );
        } catch (err) {
          alert("Failed to add set: " + err.message);
        }
      } else {
        // Existing set - PUT update
        try {
          await onUpdateSetBackend({ id, ...payload });
        } catch (err) {
          alert("Failed to update set: " + err.message);
        }
      }
    } else {
      console.log("Skipping update, invalid reps or weight");
    }
  };

  const handleAddSet = () => {
    const newSet = {
      id: tempIdCounter,
      reps: "",
      weight: "",
    };
    setEditableSets([...editableSets, newSet]);
    setTempIdCounter(tempIdCounter - 1);
  };

  const handleDeleteSet = async (id) => {
    if (onDeleteSetBackend) {
      try {
        await onDeleteSetBackend(id);
        setEditableSets(editableSets.filter((set) => set.id !== id));
      } catch (err) {
        alert("Failed to delete set: " + err.message);
      }
    } else {
      setEditableSets(editableSets.filter((set) => set.id !== id));
    }
  };

  return (
    <div className="table-responsive mt-3">
      <table className="table table-sm table-striped border align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col">Reps</th>
            <th scope="col">Weight (lbs)</th>
            <th scope="col" style={{ width: "1%" }}></th>
          </tr>
        </thead>
        <tbody>
          {editableSets.map((set) => (
            <tr key={set.id}>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={set.reps}
                  onChange={(e) =>
                    handleChange(
                      set.id,
                      "reps",
                      e.target.value === "" ? "" : parseInt(e.target.value, 10)
                    )
                  }
                  onBlur={() => handleBlur(set.id)}
                  min="0"
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={set.weight}
                  onChange={(e) =>
                    handleChange(
                      set.id,
                      "weight",
                      e.target.value === "" ? "" : parseFloat(e.target.value)
                    )
                  }
                  onBlur={() => handleBlur(set.id)}
                  min="0"
                  step="0.01"
                />
              </td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteSet(set.id)}
                  aria-label={`Delete set ${set.id}`}
                >
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={handleAddSet}
        >
          + Add Set
        </button>
      </div>
    </div>
  );
}
