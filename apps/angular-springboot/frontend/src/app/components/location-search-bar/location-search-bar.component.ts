import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-search-bar',
  templateUrl: './location-search-bar.component.html',
  styleUrls: ['./location-search-bar.component.scss']
})
export class LocationSearchBarComponent implements OnInit {
  searchQuery = '';
  @Output() search = new EventEmitter<string>();
  @Input() loading = false;
  @Input() error: string | null = null;

  constructor() {
    console.log('[LocationSearchBar] constructor called');
  }

  ngOnInit() {
    console.log('[LocationSearchBar] ngOnInit called');
    console.log('[LocationSearchBar] Initial searchQuery:', this.searchQuery);
    console.log('[LocationSearchBar] Initial loading:', this.loading);
    console.log('[LocationSearchBar] Initial error:', this.error);
  }

  onSubmit(event?: Event) {
    console.log('[LocationSearchBar] onSubmit called. Event:', event);
    if (event) {
      event.preventDefault();
      console.log('[LocationSearchBar] event.preventDefault() called');
    }
    console.log('[LocationSearchBar] searchQuery:', this.searchQuery);
    if (!this.searchQuery.trim()) {
      console.log('[LocationSearchBar] searchQuery is empty, aborting');
      return;
    }
    this.error = null;
    this.loading = true;
    console.log('[LocationSearchBar] Emitting search event with:', this.searchQuery.trim());
    this.search.emit(this.searchQuery.trim());
  }
}
