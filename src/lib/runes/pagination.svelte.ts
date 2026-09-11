type Props = {
  page?: number,
  pageSize?: number,
  total?: number
}

export default class PaginationState {
  page: number;
  pageSize: number;
  total: number | null

  constructor(props?: Props) {
    this.page = $state(props?.page ?? 1)
    this.pageSize = $state(props?.pageSize ?? 10)
    this.total = $state(props?.total ?? null)
  }

  get offset() {
    return (this.page - 1) * this.pageSize;
  }

  get start() {
    return this.offset + 1;
  }

  get end() {
    if (this.total === null) return this.offset;
    return Math.min(this.offset + this.pageSize, this.total);
  }

  get hasPrevious() {
    return this.page > 1;
  }

  get hasNext() {
    return this.total === null
      ? false
      : this.page * this.pageSize < this.total;
  }

  next = () => {
    if (this.hasNext) this.page++;
  }

  previous = () => {
    if (this.hasPrevious) this.page--;
  }

  reset = () => {
    this.page = 1;
  }
}
