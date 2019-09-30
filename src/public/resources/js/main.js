window.onload = function () {
    document
        .getElementsByClassName('search_events')[0]
        .addEventListener('click', onClickReadEvent)
}

async function onClickReadEvent() {
    const resultDiv = document.getElementsByClassName('results')[0];

    const iterationId = document.getElementsByClassName('iteration_id')[0].value;
    const eventName = document.getElementsByClassName('event_name')[0].value;
    const aggregate = document.getElementsByClassName('aggregate')[0].checked;
    
    const story = await fetchEvent(eventName, iterationId, aggregate);
    const array = await story.json();
    const html = array
        .data
        .map(json => `<div>${JSON.stringify(json, null, 4)}<div>`)
        .join('');
    resultDiv.innerHTML = html;
}

function fetchEvent(eventName, iterationId, aggregate) {
    return fetch('/api/read', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            iterationId,
            eventName,
            aggregate
        })
    });
}
