const STORAGE_KEY = "coveyWeeklyPlanner";
const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
];
const BLOCKS = ["morning", "midday", "afternoon", "evening"];
const QUADRANTS = ["q1", "q2", "q3", "q4"];

let plannerState = createDefaultState();

const weekStartInput = document.getElementById("week-start");
const weeklyFocusInput = document.getElementById("weekly-focus");
const weeklyReviewInput = document.getElementById("weekly-review");
const addRoleButton = document.getElementById("add-role");
const resetButton = document.getElementById("reset-planner");
const rolesBody = document.getElementById("roles-body");
const quadrantInputs = QUADRANTS.map((key) => document.getElementById(`quadrant-${key}`));
const scheduleInputs = Array.from(document.querySelectorAll("textarea[data-day][data-block]"));

function createDefaultState() {
    const schedule = {};
    DAYS.forEach((day) => {
        schedule[day] = {};
        BLOCKS.forEach((block) => {
            schedule[day][block] = "";
        });
    });

    return {
        weekStart: "",
        weeklyFocus: "",
        roles: [{ role: "", goal: "" }],
        quadrants: {
            q1: "",
            q2: "",
            q3: "",
            q4: ""
        },
        schedule,
        weeklyReview: ""
    };
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return createDefaultState();
        }

        const parsed = JSON.parse(raw);
        const base = createDefaultState();
        return {
            ...base,
            ...parsed,
            roles: Array.isArray(parsed.roles) && parsed.roles.length
                ? parsed.roles.map((entry) => ({ role: entry.role || "", goal: entry.goal || "" }))
                : base.roles,
            quadrants: {
                ...base.quadrants,
                ...(parsed.quadrants || {})
            },
            schedule: mergeSchedule(base.schedule, parsed.schedule || {}),
            weeklyReview: parsed.weeklyReview || ""
        };
    } catch (error) {
        console.error("Unable to load planner state", error);
        return createDefaultState();
    }
}

function mergeSchedule(baseSchedule, storedSchedule) {
    const schedule = { ...baseSchedule };
    DAYS.forEach((day) => {
        schedule[day] = { ...baseSchedule[day] };
        if (storedSchedule[day]) {
            BLOCKS.forEach((block) => {
                schedule[day][block] = storedSchedule[day][block] || "";
            });
        }
    });
    return schedule;
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plannerState));
    } catch (error) {
        console.error("Unable to save planner state", error);
    }
}

function renderRoles() {
    if (!plannerState.roles.length) {
        plannerState.roles.push({ role: "", goal: "" });
    }

    rolesBody.innerHTML = "";

    plannerState.roles.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.classList.add("role-row");

        const roleCell = document.createElement("td");
        const roleInput = document.createElement("input");
        roleInput.type = "text";
        roleInput.placeholder = "Leader, Parent, Student...";
        roleInput.value = entry.role || "";
        roleInput.dataset.index = index;
        roleInput.dataset.field = "role";
        roleInput.addEventListener("input", handleRoleChange);
        roleCell.appendChild(roleInput);

        const goalCell = document.createElement("td");
        const goalInput = document.createElement("input");
        goalInput.type = "text";
        goalInput.placeholder = "Define one meaningful weekly outcome";
        goalInput.value = entry.goal || "";
        goalInput.dataset.index = index;
        goalInput.dataset.field = "goal";
        goalInput.addEventListener("input", handleRoleChange);
        goalCell.appendChild(goalInput);

        const actionCell = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-role";
        removeButton.textContent = "Remove";
        removeButton.dataset.index = index;
        removeButton.disabled = plannerState.roles.length === 1;
        removeButton.addEventListener("click", handleRoleRemoval);
        actionCell.appendChild(removeButton);

        row.appendChild(roleCell);
        row.appendChild(goalCell);
        row.appendChild(actionCell);

        rolesBody.appendChild(row);
    });
}

function handleRoleChange(event) {
    const index = Number(event.target.dataset.index);
    const field = event.target.dataset.field;
    if (Number.isInteger(index) && field && plannerState.roles[index]) {
        plannerState.roles[index][field] = event.target.value;
        saveState();
    }
}

function handleRoleRemoval(event) {
    const index = Number(event.target.dataset.index);
    if (!Number.isInteger(index) || plannerState.roles.length === 1) {
        return;
    }
    plannerState.roles.splice(index, 1);
    renderRoles();
    saveState();
}

function handleAddRole() {
    plannerState.roles.push({ role: "", goal: "" });
    renderRoles();
    saveState();
}

function applyStateToInputs() {
    if (weekStartInput) {
        weekStartInput.value = plannerState.weekStart || "";
    }
    if (weeklyFocusInput) {
        weeklyFocusInput.value = plannerState.weeklyFocus || "";
    }
    if (weeklyReviewInput) {
        weeklyReviewInput.value = plannerState.weeklyReview || "";
    }

    quadrantInputs.forEach((input, index) => {
        if (input) {
            const key = QUADRANTS[index];
            input.value = plannerState.quadrants[key] || "";
        }
    });

    scheduleInputs.forEach((textarea) => {
        const day = textarea.dataset.day;
        const block = textarea.dataset.block;
        if (day && block && plannerState.schedule[day]) {
            textarea.value = plannerState.schedule[day][block] || "";
        }
    });

    renderRoles();
}

function handleScheduleInput(event) {
    const day = event.target.dataset.day;
    const block = event.target.dataset.block;
    if (day && block && plannerState.schedule[day]) {
        plannerState.schedule[day][block] = event.target.value;
        saveState();
    }
}

function handleQuadrantInput(event) {
    const quadrant = event.target.id.replace("quadrant-", "");
    if (plannerState.quadrants[quadrant] !== undefined) {
        plannerState.quadrants[quadrant] = event.target.value;
        saveState();
    }
}

function bindEventListeners() {
    if (weekStartInput) {
        weekStartInput.addEventListener("change", (event) => {
            plannerState.weekStart = event.target.value;
            saveState();
        });
    }

    if (weeklyFocusInput) {
        weeklyFocusInput.addEventListener("input", (event) => {
            plannerState.weeklyFocus = event.target.value;
            saveState();
        });
    }

    if (weeklyReviewInput) {
        weeklyReviewInput.addEventListener("input", (event) => {
            plannerState.weeklyReview = event.target.value;
            saveState();
        });
    }

    scheduleInputs.forEach((textarea) => {
        textarea.addEventListener("input", handleScheduleInput);
    });

    quadrantInputs.forEach((input) => {
        if (input) {
            input.addEventListener("input", handleQuadrantInput);
        }
    });

    if (addRoleButton) {
        addRoleButton.addEventListener("click", handleAddRole);
    }

    if (resetButton) {
        resetButton.addEventListener("click", handleResetPlanner);
    }
}

function handleResetPlanner() {
    const shouldReset = window.confirm("Clear all planner data for this week?");
    if (!shouldReset) {
        return;
    }
    plannerState = createDefaultState();
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Unable to clear planner state", error);
    }
    applyStateToInputs();
}

(function init() {
    plannerState = loadState();
    bindEventListeners();
    applyStateToInputs();
})();
