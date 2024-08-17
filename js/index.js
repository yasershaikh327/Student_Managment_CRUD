var count = 0;

function incrementValue() {
    // Increment the count first
    count++;
    // Update the value of the HTML element with the new count
    document.getElementById('id').value = count;
}


$(document).ready(function() {
    $('#studentForm').on('submit', function(event) {
        event.preventDefault();
        incrementValue();

        var studentData = {
            id: document.getElementById('id').value,
            name: document.getElementById('name').value,
        };

        $.ajax({
            url: 'http://localhost:3001/addstudent',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(studentData),
            success: function(response) {
                alert(response);
                $('#studentForm')[0].reset();
                fetchStudents();  // Automatically refresh the student list
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('An error occurred while adding the student');
            }
        });
    });

    $('#fetchStudents').on('click', function() {
        fetchStudents();
    });

    function fetchStudents() {
        $.ajax({
            url: 'http://localhost:3001/students',
            type: 'GET',
            success: function(students) {
                $('#studentList').empty();
                students.forEach(function(student) {
                    $('#studentList').append(
                        `<tr data-id="${student.id}">
                            <td>${student.id}</td>
                            <td><input type="text" class="editable" value="${student.name}"></td>
                            <td>
                                <button class="save-btn">Update</button>
                                <button class="delete-btn">Delete</button>
                            </td>
                        </tr>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('An error occurred while fetching students');
            }
        });
    }

    $('#studentList').on('click', '.save-btn', function() {
        let row = $(this).closest('tr');
        let id = row.data('id');
        let name = row.find('.editable').val();

        $.ajax({
            url: 'http://localhost:3001/updatestudent/' + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ name: name }),
            success: function(response) {
                alert('Student updated successfully');
                fetchStudents();  // Refresh the student list
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('An error occurred while updating the student');
            }
        });
    });

    $('#studentList').on('click', '.delete-btn', function() {
        let row = $(this).closest('tr');
        let id = row.data('id');

        if (confirm('Are you sure you want to delete this student?')) {
            $.ajax({
                url: 'http://localhost:3001/deletestudent/' + id,
                type: 'DELETE',
                success: function(response) {
                    alert(response);
                    fetchStudents();  // Refresh the student list
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    alert('An error occurred while deleting the student');
                }
            });
        }
    });
});
