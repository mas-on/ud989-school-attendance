/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    var model = {        
        getAll: function() {
            return JSON.parse(localStorage.attendance);
        },
        update: function(newAttendance) {
            localStorage.attendance = JSON.stringify(newAttendance);
        }
    };
    
    var octopus = {
        init: function() {
            view.init();
            view.render();
        },
        getAttendance: function() {
            return model.getAll();
        },
        getMissing: function() {
            const attendData = model.getAll();
            let missing = {};
            for (const [key, dayChecks] of Object.entries(attendData)) {                                
                let numMissed = 0;
                dayChecks.forEach(checked => { if (checked)  numMissed++; });                
                missing[key] = numMissed;
              }
            return missing;
        },
        updateAttendance: function(newAttendance) {
            model.update(newAttendance);
            view.render();
        }
    };

    var view = {
        init: function() {            
            // When a checkbox is clicked, update localStorage
            const $allCheckboxes = $('tbody input');
            $allCheckboxes.on('click', function() {
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                        $allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    $allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });
                octopus.updateAttendance(newAttendance);
                
                
            });
        },
        render: function() {
            const attendData = octopus.getAttendance();
            const missing = octopus.getMissing();
            
            // Check boxes, based on attendace records
            $.each(attendData, function(name, days) {
                const studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input'),
                    missedCol = $(studentRow).children('.missed-col');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });

                missedCol.text(missing[name]);
            });

            
        }
    }
     
    octopus.init();
}());
