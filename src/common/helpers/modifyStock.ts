export async function aumentarStock(id: number, cant: number) {
  const resource = await this.resourceServices.findOne({ term: id });
  if (resource) {
    resource.quatity + cant;
  }
  return 'ok';
}

export async function disminuirStock(id: number, cant: number) {
  const resource = await this.resourceServices.findOne({ term: id });
  if (resource) {
    resource.quatity - cant;
  }
  return 'ok';
}
