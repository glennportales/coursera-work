const STORAGE_KEY = "coveyWeeklyPlanner";
const DRAG_MIME = "application/x-covey-planner";
const DAY_SEQUENCE = [
    { id: "sunday", label: "Sunday", short: "Sun" },
    { id: "monday", label: "Monday", short: "Mon" },
    { id: "tuesday", label: "Tuesday", short: "Tue" },
    { id: "wednesday", label: "Wednesday", short: "Wed" },
    { id: "thursday", label: "Thursday", short: "Thu" },
    { id: "friday", label: "Friday", short: "Fri" },
    { id: "saturday", label: "Saturday", short: "Sat" }
];
const BLOCKS = [
    { id: "morning", label: "Morning" },
    { id: "midday", label: "Midday" },
    { id: "afternoon", label: "Afternoon" },
    { id: "evening", label: "Evening" }
];
const QUADRANTS = ["q1", "q2", "q3", "q4"];
const SUGGESTED_ROLES = [
    "Leader",
    "Manager",
    "Parent",
    "Partner",
    "Friend",
    "Mentor",
    "Learner",
    "Health",
    "Community",
    "Creative"
];
const QUADRANT_LABELS = {
    q1: "Urgent · Important",
    q2: "Not Urgent · Important",
    q3: "Urgent · Not Important",
    q4: "Not Urgent · Not Important"
};

let plannerState = createDefaultState();

let draggedMatrixItemId = null;

const weekStartInput = document.getElementById("week-start");
const weekStartDaySelect = document.getElementById("week-start-day");
const weekSelector = document.getElementById("week-selector");
const weekRangeDisplay = document.getElementById("week-range");
const weeklyFocusInput = document.getElementById("weekly-focus");
const weeklyReviewInput = document.getElementById("weekly-review");
const rolesListEl = document.getElementById("roles-list");
const matrixLists = Array.from(document.querySelectorAll(".matrix__list"));
const matrixContainer = document.querySelector(".matrix");
const addRoleButton = document.getElementById("add-role");
const suggestRoleButton = document.getElementById("suggest-role");
const resetButton = document.getElementById("reset-planner");
const scheduleHeaderRow = document.getElementById("schedule-header-row");
const scheduleBody = document.getElementById("schedule-body");

function createDefaultState() {
    return {
        settings: {
            startDay: "monday"
        },
        roles: [],
        weeks: {},
        activeWeekKey: null
    };
}

function createEmptySchedule() {
    const schedule = {};
    DAY_SEQUENCE.forEach(({ id }) => {
        schedule[id] = {};
        BLOCKS.forEach(({ id: blockId }) => {
            schedule[id][blockId] = "";
        });
    });
    return schedule;
}

function createEmptyWeek(weekStartDate) {
    return {
        weekStartDate,
        weeklyFocus: "",
        weeklyReview: "",
        goals: {},
        matrixItems: {},
        quadrants: {
            q1: [],
            q2: [],
            q3: [],
            q4: []
        },
        schedule: createEmptySchedule()
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
            return createBootstrappedState();
        }
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") {
            return createBootstrappedState();
        }

        const state = createBootstrappedState();
        if (parsed.settings && typeof parsed.settings.startDay === "string") {
            state.settings.startDay = parsed.settings.startDay;
        }

        if (Array.isArray(parsed.roles)) {
            state.roles = parsed.roles
                .filter((role) => role && typeof role === "object")
                .map((role) => ({
                    id: role.id || generateId("role"),
                    name: role.name || role.role || "",
                    color: role.color || "#c1121f"
                }));
        }

        if (parsed.weeks && typeof parsed.weeks === "object") {
            Object.entries(parsed.weeks).forEach(([key, value]) => {
                if (!value || typeof value !== "object") {
                    return;
                }
                const weekStartDate = value.weekStartDate || key;
                const week = createEmptyWeek(weekStartDate);
                week.weekStartDate = weekStartDate;
                week.weeklyFocus = value.weeklyFocus || "";
                week.weeklyReview = value.weeklyReview || "";
                week.schedule = mergeSchedule(createEmptySchedule(), value.schedule || {});

                if (value.goals && typeof value.goals === "object") {
                    Object.entries(value.goals).forEach(([roleId, goals]) => {
                        week.goals[roleId] = Array.isArray(goals)
                            ? goals.map((goal) => ({
                                  id: goal.id || generateId("goal"),
                                  text: goal.text || goal.goal || "",
                                  importance: goal.importance === "notImportant" ? "notImportant" : "important",
                                  urgency: goal.urgency === "urgent" ? "urgent" : goal.urgency === "notUrgent" ? "notUrgent" : "notUrgent",
                                  matrixId: goal.matrixId || null
                              }))
                            : [];
                    });
                }

                if (value.matrixItems && typeof value.matrixItems === "object") {
                    Object.entries(value.matrixItems).forEach(([itemId, item]) => {
                        week.matrixItems[itemId] = {
                            id: itemId,
                            type: item.type === "manual" ? "manual" : "goal",
                            text: item.text || "",
                            roleId: item.roleId || null,
                            goalId: item.goalId || null,
                            importance: item.importance === "notImportant" ? "notImportant" : "important",
                            urgency: item.urgency === "urgent" ? "urgent" : item.urgency === "notUrgent" ? "notUrgent" : "notUrgent",
                            quadrant: QUADRANTS.includes(item.quadrant)
                                ? item.quadrant
                                : determineQuadrant(
                                      item.importance === "notImportant" ? "notImportant" : "important",
                                      item.urgency === "urgent" ? "urgent" : "notUrgent"
                                  )
                        };
                    });
                }

                if (value.quadrants && typeof value.quadrants === "object") {
                    QUADRANTS.forEach((quadrant) => {
                        const stored = value.quadrants[quadrant];
                        week.quadrants[quadrant] = Array.isArray(stored)
                            ? stored.filter((id) => typeof id === "string")
                            : [];
                    });
                }

                state.weeks[weekStartDate] = week;
            });
        }

        state.activeWeekKey = typeof parsed.activeWeekKey === "string" && parsed.weeks?.[parsed.activeWeekKey]
            ? parsed.activeWeekKey
            : null;

        return sanitizeState(state);
    } catch (error) {
        console.warn("Unable to load planner state, using defaults", error);
        return createBootstrappedState();
    }
}

function createBootstrappedState() {
    const state = createDefaultState();
    const defaultRole = createRole("", "#c1121f");
    state.roles.push(defaultRole);
    const today = new Date();
    const start = getWeekStart(today, state.settings.startDay);
    const weekKey = formatISODate(start);
    state.weeks[weekKey] = createEmptyWeek(weekKey);
    ensureWeekHasRole(state.weeks[weekKey], defaultRole.id);
    state.activeWeekKey = weekKey;
    return state;
}

function sanitizeState(state) {
    if (!state.roles.length) {
        state.roles.push(createRole("", "#c1121f"));
    }
    if (!state.activeWeekKey || !state.weeks[state.activeWeekKey]) {
        const today = new Date();
        const start = getWeekStart(today, state.settings.startDay);
        const weekKey = formatISODate(start);
        if (!state.weeks[weekKey]) {
            state.weeks[weekKey] = createEmptyWeek(weekKey);
        }
        state.activeWeekKey = weekKey;
    }
    Object.values(state.weeks).forEach((week) => {
        state.roles.forEach((role) => ensureWeekHasRole(week, role.id));
        Object.entries(week.goals).forEach(([roleId, goals]) => {
            if (!Array.isArray(goals)) {
                week.goals[roleId] = [];
                return;
            }
            goals.forEach((goal) => {
                if (!goal.id) {
                    goal.id = generateId("goal");
                }
                if (!goal.importance) {
                    goal.importance = "important";
                }
                if (!goal.urgency) {
                    goal.urgency = "notUrgent";
                }
                if (!goal.matrixId) {
                    goal.matrixId = generateId("matrix");
                }
                if (!week.matrixItems[goal.matrixId]) {
                    const quadrant = determineQuadrant(goal.importance, goal.urgency);
                    week.matrixItems[goal.matrixId] = {
                        id: goal.matrixId,
                        type: "goal",
                        text: "",
                        roleId,
                        goalId: goal.id,
                        importance: goal.importance,
                        urgency: goal.urgency,
                        quadrant
                    };
                }
            });
        });
        ensureQuadrantIntegrity(week);
    });
    return state;
}

function mergeSchedule(baseSchedule, storedSchedule) {
    const schedule = { ...baseSchedule };
    DAY_SEQUENCE.forEach(({ id }) => {
        schedule[id] = { ...baseSchedule[id] };
        if (storedSchedule[id]) {
            BLOCKS.forEach(({ id: blockId }) => {
                schedule[id][blockId] = storedSchedule[id][blockId] || "";
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

function mergeWeekData(target, source) {
    if (!source) {
        return target;
    }

    target.weeklyFocus = target.weeklyFocus || source.weeklyFocus || "";
    target.weeklyReview = target.weeklyReview || source.weeklyReview || "";

    DAY_SEQUENCE.forEach(({ id }) => {
        BLOCKS.forEach(({ id: blockId }) => {
            if (!target.schedule[id][blockId] && source.schedule?.[id]?.[blockId]) {
                target.schedule[id][blockId] = source.schedule[id][blockId];
            }
        });
    });

    if (source.goals) {
        Object.entries(source.goals).forEach(([roleId, goals]) => {
            if (!Array.isArray(goals)) {
                return;
            }
            if (!Array.isArray(target.goals[roleId])) {
                target.goals[roleId] = [];
            }
            const existingMap = new Map(target.goals[roleId].map((goal) => [goal.id, goal]));
            goals.forEach((goal) => {
                const entry = existingMap.get(goal.id);
                if (entry) {
                    if (!entry.text && goal.text) {
                        entry.text = goal.text;
                    }
                    entry.importance = goal.importance;
                    entry.urgency = goal.urgency;
                    entry.matrixId = entry.matrixId || goal.matrixId || null;
                } else {
                    target.goals[roleId].push({
                        id: goal.id || generateId("goal"),
                        text: goal.text || "",
                        importance: goal.importance === "notImportant" ? "notImportant" : "important",
                        urgency: goal.urgency === "urgent" ? "urgent" : "notUrgent",
                        matrixId: goal.matrixId || null
                    });
                }
            });
        });
    }

    if (source.matrixItems) {
        Object.entries(source.matrixItems).forEach(([itemId, item]) => {
            if (!target.matrixItems[itemId]) {
                target.matrixItems[itemId] = { ...item };
            }
        });
    }

    if (source.quadrants) {
        QUADRANTS.forEach((quadrant) => {
            const ids = Array.isArray(source.quadrants[quadrant]) ? source.quadrants[quadrant] : [];
            if (!Array.isArray(target.quadrants[quadrant])) {
                target.quadrants[quadrant] = [];
            }
            ids.forEach((id) => {
                if (!target.quadrants[quadrant].includes(id)) {
                    target.quadrants[quadrant].push(id);
                }
            });
        });
    }

    return target;
}


function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plannerState));
    } catch (error) {

        console.error("Unable to persist planner state", error);
    }
}

function generateId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`;
}

function createRole(name = "", color = "#c1121f") {
    return {
        id: generateId("role"),
        name,
        color
    };
}

function ensureWeekHasRole(week, roleId) {
    if (!week.goals[roleId]) {
        week.goals[roleId] = [];
    }
}

function ensureQuadrantIntegrity(week) {
    QUADRANTS.forEach((quadrant) => {
        if (!Array.isArray(week.quadrants[quadrant])) {
            week.quadrants[quadrant] = [];
        }
        week.quadrants[quadrant] = week.quadrants[quadrant].filter((itemId) => week.matrixItems[itemId]);
    });
    Object.values(week.matrixItems).forEach((item) => {
        if (!week.quadrants[item.quadrant]) {
            week.quadrants[item.quadrant] = [];
        }
        if (!week.quadrants[item.quadrant].includes(item.id)) {
            week.quadrants[item.quadrant].push(item.id);
        }
    });
}

function getWeekStart(date, startDay) {
    const dayIndex = DAY_SEQUENCE.findIndex((day) => day.id === startDay);
    const jsDay = date.getDay();
    const diff = (jsDay - dayIndex + 7) % 7;
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - diff);
    return start;
}

function formatISODate(date) {
    return date.toISOString().slice(0, 10);
}

function formatReadableDate(date) {
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function rotateDays(startDay) {
    const startIndex = DAY_SEQUENCE.findIndex((day) => day.id === startDay);
    if (startIndex === -1) {
        return DAY_SEQUENCE.slice();
    }
    return DAY_SEQUENCE.slice(startIndex).concat(DAY_SEQUENCE.slice(0, startIndex));
}

function getActiveWeek() {
    return plannerState.weeks[plannerState.activeWeekKey];
}

function updateWeekRangeDisplay() {
    if (!weekRangeDisplay) {
        return;
    }
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        weekRangeDisplay.textContent = "";
        return;
    }
    const start = new Date(activeWeek.weekStartDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const startLabel = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const endLabel = end.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const yearLabel = start.getFullYear() !== end.getFullYear() ? ` ${start.getFullYear()} – ${end.getFullYear()}` : ` ${start.getFullYear()}`;
    weekRangeDisplay.textContent = `${startLabel} – ${endLabel}${yearLabel}`;
}

function updateWeekSelectorOptions() {
    if (!weekSelector) {
        return;
    }
    const options = Object.keys(plannerState.weeks)
        .sort((a, b) => (a < b ? 1 : -1));
    weekSelector.innerHTML = "";
    options.forEach((key) => {
        const option = document.createElement("option");
        const week = plannerState.weeks[key];
        const date = new Date(week.weekStartDate);
        option.value = key;
        option.textContent = `Week of ${formatReadableDate(date)}`;
        if (key === plannerState.activeWeekKey) {
            option.selected = true;
        }
        weekSelector.appendChild(option);
    });
    if (!options.includes(plannerState.activeWeekKey) && plannerState.activeWeekKey) {
        const activeWeek = plannerState.weeks[plannerState.activeWeekKey];
        if (activeWeek) {
            const option = document.createElement("option");
            option.value = plannerState.activeWeekKey;
            option.textContent = `Week of ${formatReadableDate(new Date(activeWeek.weekStartDate))}`;
            option.selected = true;
            weekSelector.appendChild(option);
        }
    }
    weekSelector.value = plannerState.activeWeekKey;
}

function renderWeeklyFields() {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    if (weekStartInput) {
        weekStartInput.value = activeWeek.weekStartDate;
    }
    if (weeklyFocusInput) {
        weeklyFocusInput.value = activeWeek.weeklyFocus || "";
    }
    if (weeklyReviewInput) {
        weeklyReviewInput.value = activeWeek.weeklyReview || "";
    }
    if (weekStartDaySelect) {
        weekStartDaySelect.value = plannerState.settings.startDay;
    }
    updateWeekRangeDisplay();
}

function renderRoles() {
    const activeWeek = getActiveWeek();
    if (!activeWeek || !rolesListEl) {
        return;
    }
    rolesListEl.innerHTML = "";
    plannerState.roles.forEach((role) => {
        ensureWeekHasRole(activeWeek, role.id);
        const card = document.createElement("article");
        card.className = "role-card";
        card.dataset.roleId = role.id;

        const header = document.createElement("div");
        header.className = "role-card__header";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.className = "role-name";
        nameInput.placeholder = "Role name";
        nameInput.value = role.name || "";
        nameInput.dataset.roleId = role.id;
        nameInput.dataset.roleField = "name";

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.className = "role-color";
        colorInput.value = role.color || "#c1121f";
        colorInput.dataset.roleId = role.id;
        colorInput.dataset.roleField = "color";

        const actions = document.createElement("div");
        actions.className = "role-card__actions";
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-role";
        removeButton.textContent = "Delete";
        removeButton.dataset.roleId = role.id;
        actions.appendChild(removeButton);

        header.appendChild(nameInput);
        header.appendChild(colorInput);
        header.appendChild(actions);

        const goalList = document.createElement("div");
        goalList.className = "goal-list";
        goalList.dataset.roleId = role.id;

        const goals = activeWeek.goals[role.id] || [];
        goals.forEach((goal) => {
            goalList.appendChild(createGoalRow(role, goal));
        });

        const addGoalButton = document.createElement("button");
        addGoalButton.type = "button";
        addGoalButton.className = "button button--outline";
        addGoalButton.textContent = "Add Goal";
        addGoalButton.dataset.roleId = role.id;
        addGoalButton.dataset.action = "add-goal";

        card.appendChild(header);
        card.appendChild(goalList);
        card.appendChild(addGoalButton);
        rolesListEl.appendChild(card);
    });
}

function createGoalRow(role, goal) {
    const row = document.createElement("div");
    row.className = "goal-row";
    row.dataset.roleId = role.id;
    row.dataset.goalId = goal.id;
    row.draggable = true;

    const top = document.createElement("div");
    top.className = "goal-row__top";

    const indicator = document.createElement("span");
    indicator.className = "goal-role-indicator";
    indicator.style.backgroundColor = role.color;

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.className = "goal-text";
    textInput.placeholder = "Describe the weekly goal";
    textInput.value = goal.text || "";
    textInput.dataset.roleId = role.id;
    textInput.dataset.goalId = goal.id;

    top.appendChild(indicator);
    top.appendChild(textInput);

    const flags = document.createElement("div");
    flags.className = "goal-flags";

    flags.appendChild(createToggleGroup("importance", role.id, goal));
    flags.appendChild(createToggleGroup("urgency", role.id, goal));

    const quadrantLabel = document.createElement("div");
    quadrantLabel.className = "goal-quadrant";
    quadrantLabel.textContent = getQuadrantLabel(goal);

    const actions = document.createElement("div");
    actions.className = "goal-row__actions";
    const removeGoal = document.createElement("button");
    removeGoal.type = "button";
    removeGoal.dataset.roleId = role.id;
    removeGoal.dataset.goalId = goal.id;
    removeGoal.dataset.action = "remove-goal";
    removeGoal.textContent = "Remove";
    actions.appendChild(removeGoal);

    row.appendChild(top);
    row.appendChild(flags);
    row.appendChild(quadrantLabel);
    row.appendChild(actions);

    return row;
}

function createToggleGroup(field, roleId, goal) {
    const group = document.createElement("div");
    group.className = "toggle-group";
    const isImportance = field === "importance";

    const firstButton = document.createElement("button");
    firstButton.type = "button";
    firstButton.dataset.roleId = roleId;
    firstButton.dataset.goalId = goal.id;
    firstButton.dataset.field = field;
    firstButton.dataset.value = isImportance ? "important" : "urgent";
    firstButton.textContent = isImportance ? "Important" : "Urgent";
    if ((isImportance && goal.importance !== "notImportant") || (!isImportance && goal.urgency === "urgent")) {
        firstButton.classList.add("is-active");
    }

    const secondButton = document.createElement("button");
    secondButton.type = "button";
    secondButton.dataset.roleId = roleId;
    secondButton.dataset.goalId = goal.id;
    secondButton.dataset.field = field;
    secondButton.dataset.value = isImportance ? "notImportant" : "notUrgent";
    secondButton.textContent = isImportance ? "Not Important" : "Not Urgent";
    const isSecondActive = (isImportance && goal.importance === "notImportant") || (!isImportance && goal.urgency !== "urgent");
    if (isSecondActive) {
        secondButton.classList.add("is-active");
    }

    group.appendChild(firstButton);
    group.appendChild(secondButton);
    return group;
}

function getQuadrantLabel(goal) {
    const quadrant = determineQuadrant(goal.importance, goal.urgency);
    return QUADRANT_LABELS[quadrant];
}

function renderMatrix() {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    ensureQuadrantIntegrity(activeWeek);
    matrixLists.forEach((list) => {
        const quadrant = list.dataset.quadrant;
        list.innerHTML = "";
        const items = activeWeek.quadrants[quadrant] || [];
        items.forEach((itemId, index) => {
            const item = activeWeek.matrixItems[itemId];
            if (!item) {
                return;
            }
            const element = createMatrixItemElement(item, index);
            list.appendChild(element);
        });
    });
}

function createMatrixItemElement(item, index) {
    const li = document.createElement("li");
    li.className = "matrix-item";
    li.dataset.itemId = item.id;
    li.dataset.quadrant = item.quadrant;
    li.draggable = true;

    const rank = document.createElement("span");
    rank.className = "matrix-item__rank";
    rank.textContent = index + 1;

    let roleColor = "#000000";
    let labelText = item.text || "Untitled";
    let metaText = QUADRANT_LABELS[item.quadrant];

    if (item.type === "goal") {
        const role = plannerState.roles.find((r) => r.id === item.roleId);
        const goal = findGoalById(item.roleId, item.goalId);
        if (role) {
            roleColor = role.color;
        }
        if (goal) {
            labelText = goal.text || "Untitled";
        }
        metaText = `${role?.name || "Role"} · ${metaText}`;
    } else {
        metaText = `Manual · ${metaText}`;
    }

    const roleIndicator = document.createElement("span");
    roleIndicator.className = "matrix-item__role";
    roleIndicator.style.backgroundColor = roleColor;

    const content = document.createElement("div");
    content.className = "matrix-item__content";

    if (item.type === "manual") {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "matrix-item__text-input";
        input.value = item.text || "";
        input.placeholder = "Describe task";
        input.dataset.itemId = item.id;
        content.appendChild(input);
    } else {
        const label = document.createElement("span");
        label.className = "matrix-item__label";
        label.textContent = labelText;
        content.appendChild(label);
    }

    const meta = document.createElement("span");
    meta.className = "matrix-item__meta";
    meta.textContent = metaText;
    content.appendChild(meta);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "matrix-item__delete";
    deleteButton.dataset.itemId = item.id;
    deleteButton.textContent = "×";
    if (item.type !== "manual") {
        deleteButton.disabled = true;
        deleteButton.style.visibility = "hidden";
    }

    li.appendChild(rank);
    li.appendChild(roleIndicator);
    li.appendChild(content);
    li.appendChild(deleteButton);
    return li;
}

function renderSchedule() {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    const orderedDays = rotateDays(plannerState.settings.startDay);
    scheduleHeaderRow.innerHTML = "";
    const firstTh = document.createElement("th");
    firstTh.scope = "col";
    firstTh.textContent = "Time Block";
    scheduleHeaderRow.appendChild(firstTh);
    orderedDays.forEach((day) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.dataset.day = day.id;
        th.textContent = day.label;
        scheduleHeaderRow.appendChild(th);
    });

    scheduleBody.innerHTML = "";
    BLOCKS.forEach((block) => {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.scope = "row";
        th.textContent = block.label;
        tr.appendChild(th);

        orderedDays.forEach((day) => {
            const td = document.createElement("td");
            const textarea = document.createElement("textarea");
            textarea.dataset.day = day.id;
            textarea.dataset.block = block.id;
            textarea.rows = 4;
            textarea.placeholder = block.id === "morning" && day.id === orderedDays[0].id
                ? "Focus work, key meetings, reflection..."
                : "";
            textarea.value = activeWeek.schedule[day.id][block.id] || "";
            attachScheduleListeners(textarea);
            td.appendChild(textarea);
            tr.appendChild(td);
        });

        scheduleBody.appendChild(tr);
    });
}

function attachScheduleListeners(textarea) {
    textarea.addEventListener("input", handleScheduleInput);
    textarea.addEventListener("dragover", handleScheduleDragOver);
    textarea.addEventListener("dragleave", handleScheduleDragLeave);
    textarea.addEventListener("drop", handleScheduleDrop);
}

function handleScheduleInput(event) {
    const textarea = event.target;
    const day = textarea.dataset.day;
    const block = textarea.dataset.block;
    const activeWeek = getActiveWeek();
    if (!day || !block || !activeWeek) {
        return;
    }
    activeWeek.schedule[day][block] = textarea.value;
    saveState();
}

function handleScheduleDragOver(event) {
    if (hasPlannerPayload(event.dataTransfer)) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        event.target.classList.add("is-hovered");
    }
}

function handleScheduleDragLeave(event) {
    event.target.classList.remove("is-hovered");
}

function handleScheduleDrop(event) {
    event.preventDefault();
    event.target.classList.remove("is-hovered");
    const payload = readPlannerPayload(event.dataTransfer);
    if (!payload) {
        return;
    }
    const textarea = event.target;
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    const day = textarea.dataset.day;
    const block = textarea.dataset.block;
    if (!day || !block) {
        return;
    }
    const text = getPayloadText(payload);
    if (!text) {
        return;
    }
    const existing = textarea.value.trimEnd();
    const prefix = existing.length ? "\n- " : "- ";
    textarea.value = `${existing}${prefix}${text}`;
    activeWeek.schedule[day][block] = textarea.value;
    saveState();
}

function hasPlannerPayload(dataTransfer) {
    const types = Array.from(dataTransfer?.types || []);
    return types.includes(DRAG_MIME) || types.includes("text/plain");
}

function readPlannerPayload(dataTransfer) {
    const raw = dataTransfer.getData(DRAG_MIME) || dataTransfer.getData("text/plain");
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    } catch (error) {
        return { type: "text", text: raw };
    }
}

function getPayloadText(payload) {
    if (payload.type === "matrix" && payload.itemId) {
        const activeWeek = getActiveWeek();
        const item = activeWeek?.matrixItems[payload.itemId];
        if (!item) {
            return "";
        }
        if (item.type === "manual") {
            return item.text || "";
        }
        const goal = findGoalById(item.roleId, item.goalId);
        return goal?.text || "";
    }
    if (payload.type === "goal" && payload.roleId && payload.goalId) {
        const goal = findGoalById(payload.roleId, payload.goalId);
        return goal?.text || "";
    }
    if (payload.type === "text") {
        return payload.text || "";
    }
    return "";
}

function findGoalById(roleId, goalId) {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return null;
    }
    const goals = activeWeek.goals[roleId];
    if (!Array.isArray(goals)) {
        return null;
    }
    return goals.find((goal) => goal.id === goalId) || null;
}

function handleRolesListInput(event) {
    const roleId = event.target.dataset.roleId;
    if (!roleId) {
        return;
    }
    if (event.target.dataset.roleField) {
        const field = event.target.dataset.roleField;
        updateRoleField(roleId, field, event.target.value);
        return;
    }
    const goalId = event.target.dataset.goalId;
    if (!goalId) {
        return;
    }
    if (event.target.classList.contains("goal-text")) {
        updateGoalText(roleId, goalId, event.target.value);
    }
}

function updateRoleField(roleId, field, value) {
    const role = plannerState.roles.find((entry) => entry.id === roleId);
    if (!role) {
        return;
    }
    role[field] = value;
    if (field === "color" && rolesListEl) {
        rolesListEl
            .querySelectorAll(`.role-card[data-role-id="${roleId}"] .goal-role-indicator`)
            .forEach((indicator) => {
                indicator.style.backgroundColor = value;
            });
    }
    renderMatrix();
    saveState();
}

function updateGoalText(roleId, goalId, value) {
    const goal = findGoalById(roleId, goalId);
    if (!goal) {
        return;
    }
    goal.text = value;
    syncGoalMatrixItem(roleId, goal);
    renderMatrix();
    saveState();
}

function updateManualMatrixText(itemId, value) {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    const item = activeWeek.matrixItems[itemId];
    if (!item || item.type !== "manual") {
        return;
    }
    item.text = value;
    saveState();
}

function handleRolesListClick(event) {
    const roleId = event.target.dataset.roleId;
    if (event.target.dataset.action === "add-goal" && roleId) {
        addGoalToRole(roleId);
        return;
    }
    if (event.target.dataset.action === "remove-goal" && roleId) {
        const goalId = event.target.dataset.goalId;
        removeGoal(roleId, goalId);
        return;
    }
    if (event.target.classList.contains("remove-role") && roleId) {
        removeRole(roleId);
        return;
    }
    if (event.target.dataset.field) {
        const field = event.target.dataset.field;
        const goalId = event.target.dataset.goalId;
        const value = event.target.dataset.value;
        if (roleId && goalId && field && value) {
            updateGoalToggle(roleId, goalId, field, value);
        }
    }
}

function createGoalTemplate() {
    return {
        id: generateId("goal"),
        text: "",
        importance: "important",
        urgency: "notUrgent",
        matrixId: null
    };
}

function addGoalToRole(roleId) {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    ensureWeekHasRole(activeWeek, roleId);
    const goal = createGoalTemplate();
    activeWeek.goals[roleId].push(goal);
    syncGoalMatrixItem(roleId, goal);
    renderRoles();
    renderMatrix();
    saveState();
}

function removeGoal(roleId, goalId) {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    const goals = activeWeek.goals[roleId];
    if (!Array.isArray(goals)) {
        return;
    }
    const index = goals.findIndex((goal) => goal.id === goalId);
    if (index === -1) {
        return;
    }
    const [removed] = goals.splice(index, 1);
    if (removed?.matrixId) {
        removeMatrixItem(removed.matrixId);
    }
    renderRoles();
    renderMatrix();
    saveState();
}

function removeRole(roleId) {
    if (plannerState.roles.length === 1) {
        alert("At least one role is required.");
        return;
    }
    plannerState.roles = plannerState.roles.filter((role) => role.id !== roleId);
    Object.values(plannerState.weeks).forEach((week) => {
        if (week.goals[roleId]) {
            week.goals[roleId].forEach((goal) => {
                if (goal.matrixId) {
                    delete week.matrixItems[goal.matrixId];
                    QUADRANTS.forEach((quadrant) => {
                        week.quadrants[quadrant] = week.quadrants[quadrant].filter((id) => id !== goal.matrixId);
                    });
                }
            });
        }
        delete week.goals[roleId];
    });
    renderRoles();
    renderMatrix();
    saveState();
}

function updateGoalToggle(roleId, goalId, field, value) {
    const goal = findGoalById(roleId, goalId);
    if (!goal) {
        return;
    }
    if (field === "importance") {
        goal.importance = value === "notImportant" ? "notImportant" : "important";
    }
    if (field === "urgency") {
        goal.urgency = value === "urgent" ? "urgent" : "notUrgent";
    }
    syncGoalMatrixItem(roleId, goal);
    renderRoles();
    renderMatrix();
    saveState();
}

function syncGoalMatrixItem(roleId, goal) {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    if (!goal.matrixId) {
        goal.matrixId = generateId("matrix");
    }
    const quadrant = determineQuadrant(goal.importance, goal.urgency);
    activeWeek.matrixItems[goal.matrixId] = {
        id: goal.matrixId,
        type: "goal",
        text: "",
        roleId,
        goalId: goal.id,
        importance: goal.importance,
        urgency: goal.urgency,
        quadrant
    };
    reassignMatrixItem(goal.matrixId, quadrant);
}

function determineQuadrant(importance, urgency) {
    const isImportant = importance !== "notImportant";
    const isUrgent = urgency === "urgent";
    if (isImportant && isUrgent) return "q1";
    if (isImportant && !isUrgent) return "q2";
    if (!isImportant && isUrgent) return "q3";
    return "q4";
}

function reassignMatrixItem(itemId, targetQuadrant, index = null) {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    const item = activeWeek.matrixItems[itemId];
    if (!item) {
        return;
    }
    QUADRANTS.forEach((quadrant) => {
        const position = activeWeek.quadrants[quadrant].indexOf(itemId);
        if (position !== -1) {
            activeWeek.quadrants[quadrant].splice(position, 1);
        }
    });
    item.quadrant = targetQuadrant;
    const list = activeWeek.quadrants[targetQuadrant];
    if (index === null || index < 0 || index > list.length) {
        list.push(itemId);
    } else {
        list.splice(index, 0, itemId);
    }
}

function removeMatrixItem(itemId) {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    delete activeWeek.matrixItems[itemId];
    QUADRANTS.forEach((quadrant) => {
        activeWeek.quadrants[quadrant] = activeWeek.quadrants[quadrant].filter((id) => id !== itemId);
    });
}

function handleMatrixClick(event) {
    if (event.target.matches(".matrix-add")) {
        const quadrant = event.target.dataset.addQuadrant;
        if (quadrant) {
            addManualMatrixItem(quadrant);
        }
        return;
    }
    if (event.target.matches(".matrix-item__delete")) {
        const itemId = event.target.dataset.itemId;
        if (itemId) {
            removeMatrixItem(itemId);
            renderMatrix();
            saveState();
        }
    }
}

function addManualMatrixItem(quadrant) {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    const itemId = generateId("matrix");
    activeWeek.matrixItems[itemId] = {
        id: itemId,
        type: "manual",
        text: "",
        roleId: null,
        goalId: null,
        importance: quadrant === "q1" || quadrant === "q2" ? "important" : "notImportant",
        urgency: quadrant === "q1" || quadrant === "q3" ? "urgent" : "notUrgent",
        quadrant
    };
    activeWeek.quadrants[quadrant].push(itemId);
    renderMatrix();
    saveState();
    requestAnimationFrame(() => {
        const input = document.querySelector(`.matrix-item__text-input[data-item-id="${itemId}"]`);
        if (input) {
            input.focus();
        }
    });
}

function handleMatrixInput(event) {
    if (event.target.classList.contains("matrix-item__text-input")) {
        const itemId = event.target.dataset.itemId;
        updateManualMatrixText(itemId, event.target.value);
    }
}

function handleMatrixDragStart(event) {
    const item = event.target.closest(".matrix-item");
    if (!item) {
        return;
    }
    const itemId = item.dataset.itemId;
    if (!itemId) {
        return;
    }
    draggedMatrixItemId = itemId;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(DRAG_MIME, JSON.stringify({ type: "matrix", itemId }));
    event.dataTransfer.setData("text/plain", JSON.stringify({ type: "matrix", itemId }));
    requestAnimationFrame(() => {
        item.classList.add("is-dragging");
    });
}

function handleMatrixDragEnd(event) {
    const item = event.target.closest(".matrix-item");
    if (item) {
        item.classList.remove("is-dragging");
    }
    draggedMatrixItemId = null;
    matrixLists.forEach((list) => list.classList.remove("is-hovered"));
}

function handleMatrixDragOver(event) {
    if (!draggedMatrixItemId) {
        return;
    }
    event.preventDefault();
    const list = event.currentTarget;
    list.classList.add("is-hovered");
    event.dataTransfer.dropEffect = "move";
}

function handleMatrixDragLeave(event) {
    event.currentTarget.classList.remove("is-hovered");
}

function handleMatrixDrop(event) {
    if (!draggedMatrixItemId) {
        return;
    }
    event.preventDefault();
    const list = event.currentTarget;
    const quadrant = list.dataset.quadrant;
    const index = computeDropIndex(list, event.clientY);
    reassignMatrixItem(draggedMatrixItemId, quadrant, index);
    list.classList.remove("is-hovered");
    renderMatrix();
    saveState();
}

function computeDropIndex(list, clientY) {
    const items = Array.from(list.querySelectorAll(".matrix-item"));
    for (let i = 0; i < items.length; i += 1) {
        const rect = items[i].getBoundingClientRect();
        if (clientY <= rect.top + rect.height / 2) {
            return i;
        }
    }
    return items.length;
}

function handleGoalDragStart(event) {
    const row = event.target.closest(".goal-row");
    if (!row) {
        return;
    }
    const roleId = row.dataset.roleId;
    const goalId = row.dataset.goalId;
    if (!roleId || !goalId) {
        return;
    }
    const payload = { type: "goal", roleId, goalId };
    event.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload));
    event.dataTransfer.setData("text/plain", JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "copy";
}

function handleWeekStartChange(event) {
    const selected = event.target.value;
    if (!selected) {
        return;
    }
    const newStart = getWeekStart(new Date(selected), plannerState.settings.startDay);
    const weekKey = formatISODate(newStart);
    if (!plannerState.weeks[weekKey]) {
        plannerState.weeks[weekKey] = createEmptyWeek(weekKey);
        plannerState.roles.forEach((role) => ensureWeekHasRole(plannerState.weeks[weekKey], role.id));
    }
    plannerState.activeWeekKey = weekKey;
    plannerState.weeks[weekKey].weekStartDate = weekKey;
    renderWeeklyFields();
    renderRoles();
    renderMatrix();
    renderSchedule();
    updateWeekSelectorOptions();
    saveState();
}

function handleWeekStartDayChange(event) {
    const newStartDay = event.target.value;
    if (!newStartDay) {
        return;
    }
    plannerState.settings.startDay = newStartDay;
    const activeWeek = getActiveWeek();
    const updatedWeeks = {};
    let activeTargetWeek = null;
    Object.values(plannerState.weeks).forEach((week) => {
        const recalculated = getWeekStart(new Date(week.weekStartDate), newStartDay);
        const newKey = formatISODate(recalculated);
        week.weekStartDate = newKey;
        if (!updatedWeeks[newKey]) {
            updatedWeeks[newKey] = week;
        } else if (updatedWeeks[newKey] !== week) {
            updatedWeeks[newKey] = mergeWeekData(updatedWeeks[newKey], week);
        }
        if (week === activeWeek) {
            activeTargetWeek = updatedWeeks[newKey];
        }
    });
    plannerState.weeks = updatedWeeks;
    if (activeTargetWeek) {
        plannerState.activeWeekKey = activeTargetWeek.weekStartDate;
    } else {
        const keys = Object.keys(plannerState.weeks);
        plannerState.activeWeekKey = keys[0] || null;
    }
    renderWeeklyFields();
    renderRoles();
    renderMatrix();
    renderSchedule();
    updateWeekSelectorOptions();
    saveState();
}

function handleWeekSelectorChange(event) {
    const weekKey = event.target.value;
    if (!weekKey) {
        return;
    }
    if (!plannerState.weeks[weekKey]) {
        plannerState.weeks[weekKey] = createEmptyWeek(weekKey);
        plannerState.roles.forEach((role) => ensureWeekHasRole(plannerState.weeks[weekKey], role.id));
    }
    plannerState.activeWeekKey = weekKey;
    renderWeeklyFields();
    renderRoles();
    renderMatrix();
    renderSchedule();
    updateWeekSelectorOptions();
    saveState();
}

function handleWeeklyFocusInput(event) {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    activeWeek.weeklyFocus = event.target.value;
    saveState();
}

function handleWeeklyReviewInput(event) {
    const activeWeek = getActiveWeek();
    if (!activeWeek) {
        return;
    }
    activeWeek.weeklyReview = event.target.value;
    saveState();
}

function addRole() {
    const role = createRole("", "#c1121f");
    plannerState.roles.push(role);
    Object.values(plannerState.weeks).forEach((week) => ensureWeekHasRole(week, role.id));
    const activeWeek = getActiveWeek();
    if (activeWeek) {
        const goal = createGoalTemplate();
        activeWeek.goals[role.id].push(goal);
        syncGoalMatrixItem(role.id, goal);
    }
    renderRoles();
    renderMatrix();
    saveState();
}

function suggestRole() {
    const existingNames = new Set(plannerState.roles.map((role) => (role.name || "").toLowerCase()));
    const suggestion = SUGGESTED_ROLES.find((name) => !existingNames.has(name.toLowerCase())) || "New Role";
    const role = createRole(suggestion, "#c1121f");
    plannerState.roles.push(role);
    Object.values(plannerState.weeks).forEach((week) => ensureWeekHasRole(week, role.id));
    const activeWeek = getActiveWeek();
    if (activeWeek) {
        const goal = createGoalTemplate();
        goal.text = suggestion;
        activeWeek.goals[role.id].push(goal);
        syncGoalMatrixItem(role.id, goal);
    }
    renderRoles();
    renderMatrix();
    saveState();
}

function handleReset() {
    if (!window.confirm("Reset the planner and clear the backlog?")) {
        return;
    }
    plannerState = createBootstrappedState();
    renderWeeklyFields();
    renderRoles();
    renderMatrix();
    renderSchedule();
    updateWeekSelectorOptions();
    saveState();
}

function bindEvents() {
    if (weekStartInput) {
        weekStartInput.addEventListener("change", handleWeekStartChange);
    }
    if (weekStartDaySelect) {
        weekStartDaySelect.addEventListener("change", handleWeekStartDayChange);
    }
    if (weekSelector) {
        weekSelector.addEventListener("change", handleWeekSelectorChange);
    }
    if (weeklyFocusInput) {
        weeklyFocusInput.addEventListener("input", handleWeeklyFocusInput);
    }
    if (weeklyReviewInput) {
        weeklyReviewInput.addEventListener("input", handleWeeklyReviewInput);
    }
    if (rolesListEl) {
        rolesListEl.addEventListener("input", handleRolesListInput);
        rolesListEl.addEventListener("click", handleRolesListClick);
        rolesListEl.addEventListener("dragstart", (event) => {
            if (event.target.closest(".goal-row")) {
                handleGoalDragStart(event);
            }
        });
    }
    if (matrixContainer) {
        matrixContainer.addEventListener("click", handleMatrixClick);
        matrixContainer.addEventListener("input", handleMatrixInput);
        matrixContainer.addEventListener("dragstart", (event) => {
            if (event.target.closest(".matrix-item")) {
                handleMatrixDragStart(event);
            }
        });
        matrixContainer.addEventListener("dragend", (event) => {
            if (event.target.closest(".matrix-item")) {
                handleMatrixDragEnd(event);
            }
        });
    }
    matrixLists.forEach((list) => {
        list.addEventListener("dragover", handleMatrixDragOver);
        list.addEventListener("dragleave", handleMatrixDragLeave);
        list.addEventListener("drop", handleMatrixDrop);
    });
    if (addRoleButton) {
        addRoleButton.addEventListener("click", addRole);
    }
    if (suggestRoleButton) {
        suggestRoleButton.addEventListener("click", suggestRole);
    }
    if (resetButton) {
        resetButton.addEventListener("click", handleReset);
    }
}

function init() {
    plannerState = loadState();
    renderWeeklyFields();
    renderRoles();
    renderMatrix();
    renderSchedule();
    updateWeekSelectorOptions();
    bindEvents();
}

init();
=======
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

