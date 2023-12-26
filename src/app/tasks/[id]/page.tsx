'use client'

function TaskDetail({ params }: { params: { id: string } }) {
    console.log(params.id)
    return (
        <>
            <h1>Hello detali</h1>
        </>
    );
}

export default TaskDetail;
