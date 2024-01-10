from flask import Flask, render_template, request, jsonify
from pulp import LpVariable, LpProblem, LpMinimize, lpSum, LpInteger, value

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        total_employees = int(request.form['total_employees'])
        total_shifts = int(request.form['total_shifts'])

        # Process form data and solve the problem
        shifts = [f"Shift{i}" for i in range(1, total_shifts + 1)]
        employees = [f"Employee{i}" for i in range(1, total_employees + 1)]

        costs = {}
        for key, value in request.form.items():
            if key.startswith("cost_"):
                key_parts = key.split('_')
                if len(key_parts) == 4:
                    _, employee_num, _, shift_num = key_parts
                    employee = f"Employee{employee_num}"
                    shift = f"Shift{shift_num}"
                    costs[(employee, shift)] = int(value)

        result, total_cost = solve_workforce_scheduling(shifts, employees, costs)

        return jsonify({'result': result, 'total_cost': total_cost})

    return render_template('index.html')


def solve_workforce_scheduling(shifts, employees, costs):
    prob = LpProblem("WorkforceScheduling", LpMinimize)

    shift_vars = LpVariable.dicts(
        "Assign", (employees, shifts), 0, 1, LpInteger)

    prob += lpSum(shift_vars[e][s] * costs.get((e, s), 0)
                  for e in employees for s in shifts)

    for e in employees:
        prob += lpSum(shift_vars[e][s] for s in shifts) == 1

    for s in shifts:
        prob += lpSum(shift_vars[e][s] for e in employees) == 1

    prob.solve()

    result = []
    total_cost = 0

    for e in employees:
        for s in shifts:
            if value(shift_vars[e][s]) == 1:
                cost = costs.get((e, s), 0)
                result.append({'employee': e, 'shift': s, 'cost': cost})
                total_cost += cost

    return result, total_cost


if __name__ == '__main__':
    app.run(debug=True)
