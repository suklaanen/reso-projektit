*** Settings ***
Documentation    REST API - Crud operations
Library          RequestsLibrary
Library          DateTime
Library          Collections

*** Variables ***
${BASE_URL}     http://localhost:3000
${headers}      Content-Type=application/json

*** Test Cases ***
Test GET Event Data
    ${response}   GET   ${BASE_URL}/eventLog 
    Log    ${response.json()}
    
Test GET One Event Data
    ${response}   GET   url=${BASE_URL}/eventLog?id=1
    Log    ${response.json()}

Test POST Request to Express
    ${headers}    Create Dictionary    Content-Type=application/json
    ${data}       Create Dictionary    id_automat=1    id_account=50    id_card=21    event_type=Robot Test    amount=0
    ${current_time}    Get Current Date    result_format=%Y-%m-%d %H:%M:%S
    Set To Dictionary    ${data}    time=${current_time}

    ${response}   POST   ${BASE_URL}/eventLog  json=${data}    headers=${headers}    expected_status=200
    
    Log    ${response.json()}

Test INVALID POST Data One Column Missing
    ${headers}    Create Dictionary    Content-Type=application/json
    ${data}       Create Dictionary   id_account=50    id_card=21    event_type=Robot Test    amount=120
    ${current_time}    Get Current Date    result_format=%Y-%m-%d %H:%M:%S
    Set To Dictionary    ${data}    time=${current_time}

    ${response}   POST   ${BASE_URL}/eventLog  json=${data}    headers=${headers}    expected_status=400
    
    Log    ${response.json()}

*** Keywords ***

