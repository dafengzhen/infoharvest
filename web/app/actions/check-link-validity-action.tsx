export default async function CheckLinkValidityAction(variables: string[]) {
  const responses = await Promise.all(
    variables.map((href) =>
      fetch(href, {
        headers: {
          'User-Agent': 'infoharvest/1.0.0',
        },
      }),
    ),
  );

  return responses.map((response, index) => {
    const href = variables[index];
    return {
      href,
      status: response.status,
      response,
    };
  });
}
