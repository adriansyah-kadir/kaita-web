export default class PaginationState {
  page = $state(1);
  pageSize = $state(10);
  total = $state<number | null>(null);

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
