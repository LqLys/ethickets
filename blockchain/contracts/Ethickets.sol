// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/access/Ownable.sol";



contract Ethickets is Ownable {

    struct Event {
        uint id;
        address owner;
        string name;
        string description;
        uint dateTime;
        string location;
        string imgUrl;
        mapping(uint => Ticket) tickets;
    }

    struct BasicEventInfo {
        uint id;
        address owner;
        string name;
        string description;
        uint dateTime;
        string location;
        string imgUrl;
    }

    struct Ticket {
        uint id;
        address owner;
        uint price;
        bool isForSale;
        bool isLockedIn;
    }

    uint private eventIdCounter = 0;


    mapping(uint => uint) public eventTicketIdCounters;
    mapping(uint => Event) public events;

    constructor(){}

    function createEvent(string memory _name, string memory _description, uint _dateTime, string memory _location, string memory _imgUrl) public returns(uint eventId){

        eventId = eventIdCounter++;
        Event storage newEvent = events[eventId];

        newEvent.id = eventId;
        newEvent.owner = msg.sender;
        newEvent.name = _name;
        newEvent.description = _description;
        newEvent.dateTime = _dateTime;
        newEvent.location = _location;
        newEvent.imgUrl = _imgUrl;

        return eventId;
    }

    function addTicketsToEvent(uint _eventId, uint _amount, uint _price) public {
        Event storage existingEvent = events[_eventId];
        require(existingEvent.owner == msg.sender, "Caller is not event owner");
        mapping(uint => Ticket) storage eventTickets = existingEvent.tickets;
        uint eventTicketIdCounter = eventTicketIdCounters[_eventId];
        for(uint i = 0; i < _amount; i++){
            Ticket storage ticket = eventTickets[i];
            ticket.id = eventTicketIdCounter++;
            ticket.owner = msg.sender;
            ticket.price = _price;
            ticket.isForSale = true;
            ticket.isLockedIn = false;
        }
        eventTicketIdCounters[_eventId] = eventTicketIdCounter;
    }

    function getEventTickets(uint _eventId) public view returns(Ticket[] memory){
        Event storage existingEvent = events[_eventId];
        uint eventTicketIdCounter = eventTicketIdCounters[_eventId];
        Ticket[] memory eventTickets = new Ticket[](eventTicketIdCounter);
        for(uint i = 0; i < eventTicketIdCounter; i++){
            eventTickets[i] = existingEvent.tickets[i];
        }
        return eventTickets;
    }

    function getTicketData(uint _eventId, uint _ticketId) public view returns(Ticket memory){
        return events[_eventId].tickets[_ticketId];
    }

    function lockInTicket(uint _eventId, uint _ticketId) public {
        Ticket storage ticket = events[_eventId].tickets[_ticketId];
        require(ticket.owner == msg.sender, "Caller is not ticket owner");
        ticket.isLockedIn = true;
    }

    function transferTicket(uint _eventId, uint _ticketId, address _to) public {
        Ticket storage ticket = events[_eventId].tickets[_ticketId];
        require(ticket.owner == msg.sender, "Caller is not ticket owner");
        require(!ticket.isLockedIn, "Cannot transfer locked in ticket.");
        ticket.owner = _to;
    }

    function editTicketData(uint _eventId, uint _ticketId,bool _isForSale, uint _price) public {
        Ticket storage ticket = events[_eventId].tickets[_ticketId];
        require(ticket.owner == msg.sender, "Caller is not ticket owner");
        require(!ticket.isLockedIn, "Cannot edit locked in ticket.");
        ticket.isForSale = _isForSale;
        ticket.price = _price;
    }

    function buyTicket(uint _eventId, uint _ticketId) public payable {
        Ticket storage ticket = events[_eventId].tickets[_ticketId];
        require(!ticket.isLockedIn, "Cannot buy locked in ticket.");
        require(ticket.isForSale, "Ticket is not for sale");
        require(msg.value == ticket.price, "Incorrect amount sent");

        ticket.owner = msg.sender;
        (bool sent, bytes memory data) = payable(ticket.owner).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    function getEvents() public view returns(BasicEventInfo[] memory){
        BasicEventInfo[] memory allEvents = new BasicEventInfo[](eventIdCounter);
        for(uint i = 0; i < eventIdCounter; i++){
            Event storage _event = events[i];
            allEvents[i] = BasicEventInfo(_event.id, _event.owner, _event.name, _event.description, _event.dateTime,
                _event.location, _event.imgUrl);
        }
        return allEvents;
    }

    function getEventsByOwner(address _owner) public view returns(BasicEventInfo[] memory){
        uint eventsCountForAddress = getEventsCountForAddress(_owner);
        BasicEventInfo[] memory addressEvents = new BasicEventInfo[](eventsCountForAddress);

        for(uint i = 0; i < eventsCountForAddress; i++){
            Event storage _event = events[i];
            if(_event.owner == _owner){
                addressEvents[i] = BasicEventInfo(_event.id, _event.owner, _event.name, _event.description, _event.dateTime,
                    _event.location, _event.imgUrl);
            }
        }
        return addressEvents;
    }

    function getEventsCountForAddress(address _owner) public view returns (uint){
        uint counter = 0;
        for(uint i = 0; i < eventIdCounter; i++){
            Event storage _event = events[i];
            if(_event.owner == _owner){
                counter++;
            }
        }
        return counter;
    }

}
