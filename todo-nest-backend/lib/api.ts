


// export async function apiFetch<T>(
//     endpoint: string,
//     options: RequestInit = {},
// ): Promise<T> {
//     const {method = 'GET', body, token

// )

export async function apiGraphqlFetch<T>(
    query: string,
    variables?: Record<string, any>
):Promise<T> {
    const response = await fetch(`${process.env.API_URL}/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();
    
    if (json.errors) {
        throw new Error(json.errors.map((e: any) => e.message).join('\n'));
    }
    
    return json.data as T;
}
