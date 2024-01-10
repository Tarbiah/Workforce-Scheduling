// script.js
function generateInputRows() {
    var totalEmployees = document.getElementById('total_employees').value;
    var totalShifts = document.getElementById('total_shifts').value;

    // Check if both inputs are provided
    if (totalEmployees && totalShifts) {
        var html = '';

        for (var i = 1; i <= totalEmployees; i++) {
            for (var j = 1; j <= totalShifts; j++) {
                html += '<div class="input-row">';

                // Dropdown for employee
                html += '<select name="employee_' + i + '_shift_' + j + '" required style="width: 150px;">';
                for (var emp = 1; emp <= totalEmployees; emp++) {
                    html += '<option value="' + emp + '">Employee ' + emp + '</option>';
                }
                html += '</select>';

                // Add some space
                html += '&nbsp;&nbsp;';

                // Dropdown for shift
                html += '<select name="shift_' + i + '_shift_' + j + '" required>';
                for (var shift = 1; shift <= totalShifts; shift++) {
                    html += '<option value="' + shift + '">Shift ' + shift + '</option>';
                }
                html += '</select>';

                // Add more space between Shift and Cost
                html += '&nbsp;&nbsp;&nbsp;&nbsp;';

                // Cost input with fixed dollar sign
                html += '<label for="cost_' + i + '_shift_' + j + '">$</label>';
                html += '<input type="text" name="cost_' + i + '_shift_' + j + '" placeholder="Enter cost" style="width: 120px;" required>';
                html += '</div>';
            }
        }

        document.getElementById('input_rows').innerHTML = html;

        // Add event listeners to cost inputs to handle tab key press
        var costInputs = document.querySelectorAll('[name^="cost_"]');
        costInputs.forEach(function (input, index, array) {
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Tab') {
                    // Prevent default behavior (moving focus to the next input)
                    event.preventDefault();

                    // Focus on the next cost input (if available)
                    var nextIndex = index + 1;
                    if (nextIndex < array.length) {
                        array[nextIndex].focus();
                    }
                }
            });
        });

        // Show the rows
        document.querySelectorAll('.input-row').forEach(function (row) {
            row.style.display = 'flex'; // Set display to flex for input-row
        });
    } else {
        alert('Please enter the total number of employees and shifts.');
    }
}

// script.js
function submitForm() {
    var form = document.getElementById('scheduling-form');
    var formData = new FormData(form);

    fetch('/', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            if (result.result.length > 0) {
                // Display the results in a simple text line
                var resultText = `Optimal Schedule: ${result.result.map(entry => `${entry.employee} - ${entry.shift} - Cost: $${entry.cost}`).join(', ')} | Total Cost: $${result.total_cost}`;
                alert(resultText);

                // Display the total cost on the screen
                document.getElementById('total-cost').textContent = `Total Cost: $${result.total_cost}`;
            } else {
                alert('No optimal schedule found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error occurred. Please check the console for details.');
        });
}

