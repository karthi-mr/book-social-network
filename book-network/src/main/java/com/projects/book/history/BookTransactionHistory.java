package com.projects.book.history;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.projects.book.book.Book;
import com.projects.book.common.BaseEntity;
import com.projects.book.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class BookTransactionHistory extends BaseEntity {

    private boolean returned;

    private boolean returnApproved;

    @ManyToOne
    @JoinColumn(
            name = "user_id"
    )
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(
            name = "book_id"
    )
    @JsonIgnore
    private Book book;
}
