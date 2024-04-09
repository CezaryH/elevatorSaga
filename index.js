{
    init: function(elevators, floors) {
        const getElevator = () => {
            const elevator = elevators.reduce((mem, elevator, index) => {
                if(elevator.destinationQueue.length < mem.destinationQueue) {
                    return {
                        index: index,
                        destinationQueue: elevator.destinationQueue.length
                    };
                }
                
                return mem;
            }, {
                index: 0,
                destinationQueue: 10000
            });
            
            return elevator.index;
        }
        
        const isDestinationInQueue = (elevator, floor) => {
            return elevator.destinationQueue.includes(floor);
        }
        
        const onButtonPressed = (floor) => {
            const elevId = getElevator();
            const elevator = elevators[elevId];
                        
            if(!isDestinationInQueue(elevator, floor.floorNum())) {
                elevator.goToFloor(floor.floorNum());   
            } 
        }
       
        
        floors.forEach((floor) => {
            floor.on("up_button_pressed", () => onButtonPressed(floor));
            floor.on("down_button_pressed", () => onButtonPressed(floor));
        })
        
        elevators.forEach((elevator, elevatorIndex) => {
            elevator.on("floor_button_pressed", function(floorNum) {
                if(!isDestinationInQueue(elevator, floorNum)) {
                    elevator.goToFloor(floorNum);                    
                }
            })
            
            elevator.on("passing_floor", function(floorNum, direction) { 
                if(floors[floorNum].buttonStates[direction] === "activated" && elevator.loadFactor < 1) {
                    elevator.goToFloor(floorNum, true);
                }
            });
        })
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    },
}
